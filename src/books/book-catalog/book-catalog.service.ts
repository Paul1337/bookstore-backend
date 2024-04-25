import { Injectable } from '@nestjs/common';
import { SearchBookDto } from './dto/search-book-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { Repository } from 'typeorm';
import { UserBooks } from '../entities/user-books.entity';
import { GetCategoryBooksResponse } from './responses/get-category-books.response';
import { User } from 'src/users/entities/user.entity';
import { SearchResponse } from './responses/search.response';

@Injectable()
export class BookCatalogService {
    private readonly DefaultBooksCategoryCount = 50;
    private readonly RaitingWeights = {
        stars: 5,
        views: 1,
        lib: 8,
        read: 50,
    };
    private readonly RelevanceFine = 2;
    private readonly BooksSearchPageLimit = 4; //50;

    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
        @InjectRepository(UserBooks) private userBooksRepository: Repository<UserBooks>,
    ) {}

    async search(searchBook: SearchBookDto): Promise<SearchResponse> {
        const resultBooks = await this.bookRepository
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.bookStat', 'bookStat')
            .leftJoinAndSelect('book.genres', 'genres')
            .where('LOWER(book.title) LIKE LOWER(:filterTitle)', {
                filterTitle: `%${searchBook.filters.title ?? ''}%`,
            })
            .andWhere(searchBook.filters.genres ? 'genres.name IN (:...genres)' : 'TRUE', {
                genres: searchBook.filters.genres,
            })
            .andWhere(searchBook.filters.bookStatus ? 'book.status = :bookStatus' : 'TRUE', {
                bookStatus: searchBook.filters.bookStatus,
            })
            .andWhere(
                searchBook.filters.price
                    ? `(book.cost >= :min ${searchBook.filters.price?.min ? 'and book.cost <= :max' : ''})`
                    : 'TRUE',
                {
                    min: searchBook.filters.price?.min ?? 0,
                    max: searchBook.filters.price?.max,
                },
            )
            .andWhere('book.isPublished = TRUE')
            .skip((searchBook.page - 1) * this.BooksSearchPageLimit)
            .take(this.BooksSearchPageLimit)
            .getMany();

        const { count: booksCount } = await this.bookRepository
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.bookStat', 'bookStat')
            .leftJoinAndSelect('book.genres', 'genres')
            .select('COUNT(*)', 'count')
            .where('LOWER(book.title) LIKE LOWER(:filterTitle)', {
                filterTitle: `%${searchBook.filters.title ?? ''}%`,
            })
            .andWhere(searchBook.filters.genres ? 'genres.name IN (:...genres)' : 'TRUE', {
                genres: searchBook.filters.genres,
            })
            .andWhere(searchBook.filters.bookStatus ? 'book.status = :bookStatus' : 'TRUE', {
                bookStatus: searchBook.filters.bookStatus,
            })
            .andWhere(
                searchBook.filters.price
                    ? `(book.cost >= :min ${searchBook.filters.price?.min ? 'and book.cost <= :max' : ''})`
                    : 'TRUE',
                {
                    min: searchBook.filters.price?.min ?? 0,
                    max: searchBook.filters.price?.max,
                },
            )
            .andWhere('book.isPublished = TRUE')
            .getRawOne();

        return {
            books: resultBooks.map(book => ({
                id: book.id,
                title: book.title,
                description: book.description,
                coverSrc: book.coverSrc,
                bookStat: book.bookStat,
                genres: book.genres,
                cost: book.cost,
                freeChaptersCount: book.freeChaptersCount,
                status: book.status,
            })),
            pagesCount: Math.ceil(Number(booksCount) / this.BooksSearchPageLimit),
        };
    }

    async getTopBooks(
        count: number = this.DefaultBooksCategoryCount,
    ): Promise<GetCategoryBooksResponse> {
        const resultBooks = await this.bookRepository
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.bookStat', 'bookStat')
            .where('book.isPublished = true')
            .orderBy(
                `(bookStat.starsCount * ${this.RaitingWeights.stars} + bookStat.viewsCount * ${this.RaitingWeights.views} + bookStat.addsToLibraryCount * ${this.RaitingWeights.lib} + bookStat.readCount * ${this.RaitingWeights.read})`,
                'DESC',
            )
            .limit(count)
            .getMany();

        return this.mapBooksResponse(resultBooks);
    }

    async getNewBooks(
        count: number = this.DefaultBooksCategoryCount,
    ): Promise<GetCategoryBooksResponse> {
        const resultBooks = await this.bookRepository.find({
            take: count,
            order: { publishedAt: 'DESC' },
            where: { isPublished: true },
            select: ['id', 'title', 'coverSrc', 'publishedAt'],
        });

        return this.mapBooksResponse(resultBooks);
    }

    async getRelevantBooks(
        count: number = this.DefaultBooksCategoryCount,
    ): Promise<GetCategoryBooksResponse> {
        const resultBooks = await this.bookRepository
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.bookStat', 'bookStat')
            .orderBy(
                `(-extract(day from CURRENT_DATE - book.publishedAt) * ${this.RelevanceFine} + bookStat.starsCount * ${this.RaitingWeights.stars} + bookStat.viewsCount * ${this.RaitingWeights.views} + bookStat.addsToLibraryCount * ${this.RaitingWeights.lib} + bookStat.readCount * ${this.RaitingWeights.read})`,
                'DESC',
            )
            .limit(count)
            .getMany();

        return this.mapBooksResponse(resultBooks);
    }

    mapBooksResponse(books: Book[]): GetCategoryBooksResponse {
        return books.map(book => ({
            id: book.id,
            title: book.title,
            coverSrc: book.coverSrc,
        }));
    }
}

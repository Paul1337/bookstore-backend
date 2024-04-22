import { Injectable } from '@nestjs/common';
import { SearchBookDto } from './dto/search-book-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { Repository } from 'typeorm';
import { UserBooks } from '../entities/user-books.entity';
import { GetCategoryBooksResponse } from './responses/get-category-books.response';
import { User } from 'src/users/entities/user.entity';

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

    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
        @InjectRepository(UserBooks) private userBooksRepository: Repository<UserBooks>,
    ) {}

    async search(searchBook: SearchBookDto) {
        const resultBooks = await this.bookRepository
            .createQueryBuilder('book')
            .where('lower(book.title) like lower(%:filterTitle%)', {
                filterTitle: searchBook.filterTitle ?? '',
            })
            .getMany();

        return resultBooks;
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

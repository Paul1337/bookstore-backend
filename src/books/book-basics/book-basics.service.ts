import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { Repository } from 'typeorm';
import { UserBooks } from '../entities/user-books.entity';
import { BooksLibService } from '../books-lib/books-lib.service';
import { GetPublicBookInfoResponse } from './responses/get-public-book-info.response';
import { GetPrivateBookInfoResponse } from './responses/get-private-book-info.response';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BookBasicsService {
    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
        @InjectRepository(UserBooks) private userBooksRepository: Repository<UserBooks>,
        private bookLibService: BooksLibService,
    ) {}

    async getBookPublicInfo(bookId: number): Promise<GetPublicBookInfoResponse> {
        const bookWithRelations = await this.bookRepository.findOne({
            where: { id: bookId },
            relations: ['author', 'series'],
        });

        const bookInfo = await this.bookRepository
            .createQueryBuilder('book')
            .leftJoin(UserBooks, 'bookInfo', 'book.id = bookInfo.book_id')
            .leftJoin(User, 'user', 'user.id = bookInfo.user_id')
            .select('COUNT(*)', 'starsCount')
            .where('book.id = :bookId', { bookId })
            .where('bookInfo.isStarred = true')
            .getRawOne();

        return {
            id: bookWithRelations.id,
            title: bookWithRelations.title,
            description: bookWithRelations.description,
            viewsCount: bookWithRelations.viewsCount,
            rewardsCount: bookWithRelations.rewardsCount,
            author: {
                username: bookWithRelations.author.username,
                id: bookWithRelations.author.id,
                firstName: bookWithRelations.author.firstName,
                lastName: bookWithRelations.author.lastName,
            },
            createdAt: bookWithRelations.createdAt,
            updatedAt: bookWithRelations.updatedAt,
            addsToLibraryCount: bookWithRelations.addsToLibraryCount,
            backgroundSrc: bookWithRelations.backgroundSrc,
            coverSrc: bookWithRelations.coverSrc,
            cost: bookWithRelations.cost,
            freeChaptersCount: bookWithRelations.freeChaptersCount,
            status: bookWithRelations.status,
            isPublished: bookWithRelations.isPublished,
            isBanned: bookWithRelations.isBanned,
            ageRestriction: bookWithRelations.ageRestriction,
            series: bookWithRelations.series,
            starsCount: Number(bookInfo.starsCount),
        };
    }

    async getBookPrivateInfo(bookId: number, userId: number): Promise<GetPrivateBookInfoResponse> {
        const publicBookInfo = await this.getBookPublicInfo(bookId);
        const bookInfo = await this.bookLibService.getUserBookInfo(bookId, userId);

        return {
            ...publicBookInfo,
            isStarred: bookInfo.isStarred,
            isInLibrary: bookInfo.isInLibrary,
            currentPage: bookInfo.currentPage,
        };
    }

    async starBook(bookId: number, userId: number) {
        const bookInfo = await this.bookLibService.getUserBookInfo(bookId, userId);

        bookInfo.isStarred = true;
        await this.userBooksRepository.save(bookInfo);
    }

    async unstarBook(bookId: number, userId: number) {
        const bookInfo = await this.bookLibService.getUserBookInfo(bookId, userId);
        bookInfo.isStarred = false;
        await this.userBooksRepository.save(bookInfo);
    }

    async addBookToLibrary(bookId: number, userId: number) {
        const bookInfo = await this.bookLibService.getUserBookInfo(bookId, userId);
        bookInfo.isInLibrary = true;
        await this.userBooksRepository.save(bookInfo);
    }

    async removeBookFromLibrary(bookId: number, userId: number) {
        const bookInfo = await this.bookLibService.getUserBookInfo(bookId, userId);
        bookInfo.isInLibrary = false;
        await this.userBooksRepository.save(bookInfo);
    }
}

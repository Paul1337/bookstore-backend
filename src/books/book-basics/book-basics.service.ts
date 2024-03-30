import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { Repository } from 'typeorm';
import { UserBooks } from '../entities/user-books.entity';
import { BooksLibService } from '../books-lib/books-lib.service';
import { GetPublicBookInfoResponse } from './responses/get-public-book-info.response';
import { GetPrivateBookInfoResponse } from './responses/get-private-book-info.response';
import { User } from 'src/users/entities/user.entity';
import { GetMyLibraryResponse } from './responses/get-my-library.response';

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
            relations: ['author', 'series', 'parts'],
        });

        const bookInfo = await this.bookRepository
            .createQueryBuilder('book')
            .leftJoin(UserBooks, 'bookInfo', 'book.id = bookInfo.book_id')
            .leftJoin(User, 'user', 'user.id = bookInfo.user_id')
            .select('SUM(CAST(bookInfo.isStarred as INT))', 'starsCount')
            .addSelect('SUM(CAST(bookInfo.isViewed as INT))', 'viewsCount')
            .addSelect('SUM(CAST(bookInfo.isPaid as INT))', 'paidCount')
            .where('book.id = :bookId', { bookId })
            .getRawOne();

        return {
            id: bookWithRelations.id,
            title: bookWithRelations.title,
            description: bookWithRelations.description,
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
            viewsCount: Number(bookInfo.viewsCount),
            paidCount: Number(bookInfo.paidCount),
            parts: bookWithRelations.parts.map(part => ({
                id: part.id,
                title: part.title,
            })),
        };
    }

    async getBookPrivateInfo(bookId: number, userId: number): Promise<GetPrivateBookInfoResponse> {
        const publicBookInfo = await this.getBookPublicInfo(bookId);
        const bookInfo = await this.bookLibService.getUserBookInfo(bookId, userId);

        if (!bookInfo.isViewed) {
            bookInfo.isViewed = true;
            await this.userBooksRepository.update({ id: bookInfo.id }, { isViewed: true });
        }

        return {
            ...publicBookInfo,
            isStarred: bookInfo.isStarred,
            isInLibrary: bookInfo.isInLibrary,
            currentPage: bookInfo.currentPage,
            currentPart: bookInfo.currentPart,
        };
    }

    async getMyLibrary(userId: number): Promise<GetMyLibraryResponse> {
        const books = await this.bookRepository
            .createQueryBuilder('book')
            .select(['book.title', 'book.description', 'book.coverSrc'])
            .leftJoin(UserBooks, 'bookInfo', 'bookInfo.book_id = book.id')
            .leftJoin(User, 'user', 'user.id = bookInfo.user_id')
            .where('user.id = :userId', { userId })
            .andWhere('bookInfo.isInLibrary = true')
            .getMany();

        return books;
    }

    async starBook(bookId: number, userId: number) {
        await this.bookLibService.createOrUpdateUserbookInfo(bookId, userId, { isStarred: true });
    }

    async unstarBook(bookId: number, userId: number) {
        await this.bookLibService.createOrUpdateUserbookInfo(bookId, userId, { isStarred: false });
    }

    async addBookToLibrary(bookId: number, userId: number) {
        const bookInfo = await this.bookLibService.getUserBookInfo(bookId, userId);

        if (!bookInfo.wasInLibrary) {
            await this.bookRepository
                .createQueryBuilder()
                .update(Book)
                .set({
                    addsToLibraryCount: () => 'addsToLibraryCount + 1',
                })
                .where('id = :bookId', { bookId })
                .execute();
        }

        bookInfo.isInLibrary = true;
        bookInfo.wasInLibrary = true;
        await this.userBooksRepository.save(bookInfo);
    }

    async removeBookFromLibrary(bookId: number, userId: number) {
        await this.bookLibService.createOrUpdateUserbookInfo(bookId, userId, { isInLibrary: false });
    }

    async getMyBooks(userId: number) {
        const books = await this.bookRepository.find({
            where: { authorId: userId },
        });
        return books;
    }
}

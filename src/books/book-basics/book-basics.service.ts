import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { Repository } from 'typeorm';
import { UserBooks } from '../entities/user-books.entity';
import { GetBookInfoResponse } from './responses/get-book-info.response';
import { UsersService } from 'src/users/users.service';
import { BooksLibService } from '../lib/books-lib.service';

@Injectable()
export class BookBasicsService {
    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
        @InjectRepository(UserBooks) private userBooksRepository: Repository<UserBooks>,
        private bookLibService: BooksLibService,
        // private userService: UsersService,
    ) {}

    async getBookPublicInfo(bookId: number): Promise<Book> {
        return this.bookRepository.findOne({
            where: { id: bookId },
            relations: ['author'],
        });
    }

    async getBookPrivateInfo(bookId: number, userId: number): Promise<GetBookInfoResponse> {
        const book = await this.bookRepository.findOne({
            where: { id: bookId },
            relations: ['author'],
        });

        const bookInfo = await this.bookLibService.getUserBookInfo(bookId, userId);

        return {
            ...book,
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

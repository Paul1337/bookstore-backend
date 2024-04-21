import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { BookGenre } from '../entities/book-genre.entity';
import { BookPart } from '../entities/book-part.entity';
import { Book } from '../entities/book.entity';
import { UserBooks } from '../entities/user-books.entity';

@Injectable()
export class BooksLibService {
    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
        @InjectRepository(UserBooks) private userBooksRepository: Repository<UserBooks>,
        @InjectRepository(BookPart) private bookPartRepository: Repository<BookPart>,
        @InjectRepository(BookGenre) private bookGenreRepository: Repository<BookGenre>,
    ) {}

    async getUserBookInfo(bookId: number, userId: number) {
        let bookInfo = await this.userBooksRepository.findOne({
            where: { bookId: bookId, userId: userId },
            relations: ['currentPart'],
        });

        if (!bookInfo) {
            const firstPart = await this.bookPartRepository.findOne({
                where: { bookId },
                order: { index: 'ASC' },
            });
            bookInfo = this.userBooksRepository.create({
                bookId: bookId,
                userId: userId,
                isStarred: false,
                isInLibrary: false,
                isPaid: false,
                isViewed: false,
                currentPart: firstPart,
                currentPage: 1,
            });
        }

        return bookInfo;
    }

    async createOrUpdateUserbookInfo(bookId: number, userId: number, data: DeepPartial<UserBooks>) {
        const bookInfo = await this.getUserBookInfo(bookId, userId);

        for (let prop in data) {
            bookInfo[prop] = data[prop];
        }

        await this.userBooksRepository.save(bookInfo);
    }

    async findBookGenresByNames(genres: string[]) {
        return await this.bookGenreRepository.find({
            where: {
                name: In(genres),
            },
        });
    }
}

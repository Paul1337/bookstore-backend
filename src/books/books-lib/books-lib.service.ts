import { Injectable } from '@nestjs/common';
import { DeepPartial, In, Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBooks } from '../entities/user-books.entity';
import { BookGenre } from '../entities/book-genre';

@Injectable()
export class BooksLibService {
    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
        @InjectRepository(UserBooks) private userBooksRepository: Repository<UserBooks>,
        @InjectRepository(BookGenre) private bookGenreRepository: Repository<BookGenre>,
    ) {}

    async getUserBookInfo(bookId: number, userId: number) {
        let bookInfo = await this.userBooksRepository.findOne({
            where: {
                bookId: bookId,
                userId: userId,
            },
        });

        if (!bookInfo) {
            bookInfo = this.userBooksRepository.create({
                bookId: bookId,
                userId: userId,
                isStarred: false,
                isInLibrary: false,
                isPaid: false,
                isViewed: false,
                // currentPart: 1,
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

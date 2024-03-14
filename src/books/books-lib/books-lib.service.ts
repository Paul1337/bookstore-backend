import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBooks } from '../entities/user-books.entity';

@Injectable()
export class BooksLibService {
    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
        @InjectRepository(UserBooks) private userBooksRepository: Repository<UserBooks>,
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
                currentPart: 1,
                currentPage: 1,
            });
        }

        return bookInfo;
    }
}

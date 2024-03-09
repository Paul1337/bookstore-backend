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
                book_id: bookId,
                user_id: userId,
            },
        });

        if (!bookInfo) {
            bookInfo = this.userBooksRepository.create({
                book_id: bookId,
                user_id: userId,
                isStarred: false,
                isInLibrary: false,
                isPaid: false,
                isViewed: false,
                currentPage: -1,
            });
            // await this.userBooksRepository.save(bookInfo);
        }

        return bookInfo;
    }
}

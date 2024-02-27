import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { SearchBookDto } from './dto/search-book-dto';

@Injectable()
export class BooksService {
    constructor(@InjectRepository(Book) private bookRepository: Repository<Book>) {}

    async getBookInfo(bookId: number) {
        return this.bookRepository
            .createQueryBuilder('book')
            .where('book.id = :bookId', { bookId })
            .leftJoinAndSelect('book.author', 'author')
            .getOne();

        // findOne({
        //     select: {
        //         title: true,
        //         description: true,
        //         author: true,
        //         starsCount: true,
        //     },
        //     where: {
        //         id: bookId,
        //     },
        // });
    }

    async starBook(bookId: number, userId: number) {}
    async searchBook(searchBookDto: SearchBookDto) {}
}

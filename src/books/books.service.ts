import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { SearchBookDto } from './dto/search-book-dto';

@Injectable()
export class BooksService {
    constructor(@InjectRepository(Book) private bookRepository: Repository<Book>) {}

    async likeBook(bookId: number, userId: number) {}
    async searchBook(searchBookDto: SearchBookDto) {}
}

import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { GetPagesDto } from './dto/get-pages.dto';
import { BookPage } from '../entities/book-page.entity';
import { BookPart } from '../entities/book-part.entity';
import { BooksLibService } from '../books-lib/books-lib.service';
import { UserBooks } from '../entities/user-books.entity';
import { GetPageResponse, GetPagesResponse } from './responses/get-pages.response';

@Injectable()
export class BookReadService {
    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
        @InjectRepository(BookPage) private bookPageRepository: Repository<BookPage>,
        @InjectRepository(BookPart) private bookPartRepository: Repository<BookPart>,
        private bookLibService: BooksLibService,
    ) {}

    // can possibly add validation to make sure pageFrom is less or equal to pageTo
    async getPagesPublic(getPagesDto: GetPagesDto, bookId: number): Promise<GetPagesResponse> {
        // can only access free pages
        const { pageFrom, pageTo } = getPagesDto;

        console.log('get pages public');

        const pages = await this.bookPageRepository
            .createQueryBuilder('bookPage')
            .leftJoin(Book, 'book', 'book.id = bookPage.book_id')
            .leftJoin(BookPart, 'bookPart', 'bookPart.id = bookPage.book_part_id')
            .where('bookPage.book_id = :bookId', { bookId })
            .andWhere('bookPart.index <= book.freeChaptersCount')
            .skip(pageFrom - 1)
            .take(pageTo - pageFrom + 1)
            .orderBy('bookPage.index asc')
            .getMany();

        console.log('get pages public', pages);
        return pages.map(this.mapPageToResponse);
    }

    async getPagesPrivate(
        getPagesDto: GetPagesDto,
        bookId: number,
        userId: number,
    ): Promise<GetPagesResponse> {
        // can access free pages and others if book is paid

        const { pageFrom, pageTo } = getPagesDto;

        const pages = await this.bookPageRepository
            .createQueryBuilder('bookPage')
            .leftJoin(Book, 'book', 'book.id = bookPage.book_id')
            .leftJoin(BookPart, 'bookPart', 'bookPart.id = bookPage.book_part_id')
            .leftJoin(
                UserBooks,
                'bookInfo',
                'bookInfo.user_id = :userId AND bookInfo.book_id = bookPage.book_id',
                { userId },
            )
            .where('bookPage.book_id = :bookId', { bookId })
            .andWhere('bookInfo.isPaid OR bookPart.index <= book.freeChaptersCount')
            .skip(pageFrom - 1)
            .take(pageTo - pageFrom + 1)
            .orderBy('bookPage.index asc')
            .getMany();

        console.log('get pages private', pages);

        return pages.map(this.mapPageToResponse);
    }

    mapPageToResponse(page: BookPage): GetPageResponse {
        return {
            id: page.id,
            content: page.content,
            index: page.index,
        };
    }
}

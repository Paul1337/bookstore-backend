import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { Brackets, Repository } from 'typeorm';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GetPagesDto } from './dto/get-pages.dto';
import { BookPage } from '../entities/book-page.entity';
import { BookPart } from '../entities/book-part.entity';
import { BooksLibService } from '../books-lib/books-lib.service';
import { UserBooks } from '../entities/user-books.entity';
import { GetPageResponse, GetPagesResponse } from './responses/get-pages.response';
import { GetPartDto } from './dto/get-part.dto';
import { GetPartResponse } from './responses/get-part.response';

@Injectable()
export class BookReadService {
    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
        @InjectRepository(BookPage) private bookPageRepository: Repository<BookPage>,
        @InjectRepository(BookPart) private bookPartRepository: Repository<BookPart>,
        @InjectRepository(UserBooks) private userBooksRepository: Repository<UserBooks>,
        private bookLibService: BooksLibService,
    ) {}

    async getPages(
        getPagesDto: GetPagesDto,
        bookId: number,
        userId?: number,
    ): Promise<GetPagesResponse> {
        const { currentPage, pageFrom, pageTo } = getPagesDto;

        if (pageFrom > pageTo) {
            throw new BadRequestException('Invalid data: pageFrom is greater than pageTo');
        }

        if (currentPage < pageFrom || currentPage > pageTo) {
            throw new BadRequestException(
                'Invalid data: currentPage is not in the range [pageFrom, pageTo]',
            );
        }

        const pages = await this.bookPageRepository
            .createQueryBuilder('bookPage')
            .leftJoinAndSelect('bookPage.book', 'book')
            .leftJoinAndSelect('bookPage.bookPart', 'bookPart')
            .leftJoin(
                UserBooks,
                'bookInfo',
                'bookInfo.user_id = :userId AND bookInfo.book_id = bookPage.book_id',
                { userId },
            )
            .where('bookPage.book_id = :bookId', { bookId })
            .andWhere('bookInfo.isPaid OR bookPart.index <= book.freeChaptersCount')
            .offset(pageFrom - 1)
            .limit(pageTo - pageFrom + 1)
            .addOrderBy('bookPart.index', 'ASC')
            .addOrderBy('bookPage.index', 'ASC')
            .getMany();

        // console.log(
        //     pages.map(p => ({
        //         index: p.index,
        //         book: p.bookId,
        //     })),
        // );

        const selectedCurrentPage = pages.find(page => page.index === currentPage);
        if (!selectedCurrentPage) throw new ForbiddenException('Current page can not be selected');

        if (userId) {
            await this.bookLibService.createOrUpdateUserbookInfo(bookId, userId, {
                currentPage,
                currentPart: selectedCurrentPage.bookPart.index,
            });
        }

        return pages.map(page => ({
            id: page.id,
            content: page.content,
            index: page.index,
            partIndex: page.bookPart.index,
        }));
    }

    async getPart(
        getPartDto: GetPartDto,
        bookId: number,
        partIndex: number,
        userId?: number,
    ): Promise<GetPartResponse> {
        const { pagesCount } = getPartDto;

        const bookPart = await this.bookPartRepository
            .createQueryBuilder('bookPart')
            .leftJoinAndSelect('bookPart.book', 'book')
            .leftJoinAndSelect('bookPart.pages', 'bookPage')
            .leftJoin(
                UserBooks,
                'bookInfo',
                'bookInfo.user_id = :userId AND bookInfo.book_id = bookPage.book_id',
                { userId },
            )
            .where('bookPart.book_id = :bookId', { bookId })
            .andWhere('bookPart.index = :partIndex', { partIndex })
            .andWhere('(bookInfo.isPaid OR bookPart.index <= book.freeChaptersCount)')
            .limit(pagesCount)
            .addOrderBy('bookPart.index', 'ASC')
            .addOrderBy('bookPage.index', 'ASC')
            .getOne();

        if (!bookPart) throw new BadRequestException('Book part not found');
        if (bookPart.pages.length === 0) throw new ForbiddenException('This book part is not allowed');

        return {
            firstPageIndex: bookPart.pages[0].index,
            lastPageIndex: bookPart.pages[0].index,
            pages: bookPart.pages.map(page => ({
                id: page.id,
                content: page.content,
                index: page.index,
                partIndex: bookPart.index,
            })),
        };
    }
}

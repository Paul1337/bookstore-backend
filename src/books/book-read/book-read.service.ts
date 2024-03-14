import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { Repository } from 'typeorm';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
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

        if (pageFrom > pageTo)
            throw new BadRequestException('Invalid data: pageFrom is greater than pageTo');
        if (currentPage < pageFrom || currentPage > pageTo)
            throw new BadRequestException(
                'Invalid data: currentPage is not in the range [pageFrom, pageTo]',
            );

        const pages = await this.bookPageRepository
            .createQueryBuilder('bookPage')
            .leftJoin(Book, 'book', 'book.id = bookPage.book_id')
            .leftJoinAndSelect(BookPart, 'bookPart', 'bookPart.id = bookPage.book_part_id')
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
            .getRawMany();

        console.log('pages:', pages.length);

        const selectedCurrentPage = pages.find(page => page.bookPage_index === currentPage);
        if (!selectedCurrentPage) throw new ForbiddenException('Current page can not be selected');

        console.log('Selected current page', selectedCurrentPage); //selectedCurrentPage.bookPart ???

        if (userId) {
            await this.userBooksRepository.update(
                { userId },
                {
                    currentPage,
                    currentPart: selectedCurrentPage.bookPart_index,
                },
            );
        }

        return pages.map(page => ({
            id: page.bookPage_id,
            content: page.bookPage_content,
            index: page.bookPage_index,
            partIndex: page.bookPart_index,
        }));
    }

    async getPart(
        getPartDto: GetPartDto,
        bookId: number,
        partId: number,
        userId?: number,
    ): Promise<GetPartResponse> {
        const { pagesCount } = getPartDto;

        const pages = await this.bookPartRepository
            .createQueryBuilder('bookPart')
            .leftJoin(Book, 'book', 'book.id = bookPart.book_id')
            .leftJoinAndSelect(BookPage, 'bookPage', 'bookPage.book_part_id = bookPart.id')
            .leftJoin(
                UserBooks,
                'bookInfo',
                'bookInfo.user_id = :userId AND bookInfo.book_id = bookPage.book_id',
                { userId },
            )
            .where('bookPart.id = :partId AND bookPart.book_id = :bookId', { partId, bookId })
            .andWhere('bookInfo.isPaid OR bookPart.index <= book.freeChaptersCount')
            .take(pagesCount)
            .addOrderBy('bookPart.index', 'ASC')
            .addOrderBy('bookPage.index', 'ASC')
            .getMany();

        console.log('Pages: ', pages);

        if (pages.length === 0) throw new ForbiddenException('This book part is not allowed');

        return {
            firstPageIndex: 0,
            lastPageIndex: 0,
            pages: [],
        };
    }

    // mapPageToResponse(page: BookPage): GetPageResponse {
    //     return {
    //         id: page.id,
    //         content: page.content,
    //         index: page.index,
    //         partIndex: page.bookPart.index,
    //     };
    // }
}

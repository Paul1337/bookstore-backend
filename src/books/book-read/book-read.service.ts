import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BooksLibService } from '../books-lib/books-lib.service';
import { BookPage } from '../entities/book-page.entity';
import { BookPart } from '../entities/book-part.entity';
import { UserBooks } from '../entities/user-books.entity';
import { GetPagesDto } from './dto/get-pages.dto';
import { GetPartDto } from './dto/get-part.dto';
import { GetPagesResponse } from './responses/get-pages.response';
import { GetPartResponse } from './responses/get-part.response';
import { Book } from '../entities/book.entity';

@Injectable()
export class BookReadService {
    constructor(
        @InjectRepository(BookPage) private bookPageRepository: Repository<BookPage>,
        @InjectRepository(BookPart) private bookPartRepository: Repository<BookPart>,
        @InjectRepository(Book) private bookRepository: Repository<Book>,
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

        if (pageFrom < 1) {
            throw new BadRequestException('Page from must be at least 1');
        }

        const freeBookPartIds = await this.getFreeBookPartsIds(bookId);

        const pages = await this.bookPageRepository
            .createQueryBuilder('bookPage')
            .leftJoinAndSelect('bookPage.bookPart', 'bookPart')
            .leftJoinAndSelect('bookPart.book', 'book')
            .leftJoin(
                UserBooks,
                'bookInfo',
                'bookInfo.user_id = :userId AND bookInfo.book_id = bookPart.book_id',
                { userId },
            )
            .where('bookPart.book_id = :bookId', { bookId })
            .andWhere(
                '(bookInfo.isPaid OR book.cost = 0 OR book.authorId = :userId OR bookPart.id IN (:...freeBookPartIds))',
                { freeBookPartIds, userId },
            )
            .offset(pageFrom - 1)
            .limit(pageTo - pageFrom + 1)
            .addOrderBy('bookPart.index', 'ASC')
            .addOrderBy('bookPage.index', 'ASC')
            .getMany();

        const selectedCurrentPage = pages.find((page, index) => pageFrom + index === currentPage);
        if (!selectedCurrentPage) throw new ForbiddenException('Current page can not be selected');

        if (userId) {
            await this.bookLibService.createOrUpdateUserbookInfo(bookId, userId, {
                currentPage,
                currentPart: selectedCurrentPage.bookPart,
                // currentPartId: selectedCurrentPage.bookPartId,
            });
        }

        return pages.map((page, index) => ({
            id: page.id,
            content: page.content,
            index: index + pageFrom,
        }));
    }

    async getPart(
        getPartDto: GetPartDto,
        bookId: number,
        bookPartId: number,
        userId?: number,
    ): Promise<GetPartResponse> {
        const { pagesCount = 0 } = getPartDto;

        const bookPart = await this.bookPartRepository.findOne({ where: { id: bookPartId, bookId } });
        if (!bookPart) throw new BadRequestException('That part does not exist for this book');
        const prevPages = await this.bookPageRepository
            .createQueryBuilder('bookPage')
            .select('COUNT(*)', 'count')
            .leftJoin('bookPage.bookPart', 'bookPart')
            .where('bookPart.index < :bookPartIndex', { bookPartIndex: bookPart.index })
            .andWhere('bookPart.book_id = :bookId', { bookId })
            .getRawOne();

        const currentPartPages = await this.bookPageRepository.find({
            where: { bookPartId: bookPartId },
            select: ['id'],
        });

        const firstPageIndex = Number(prevPages.count) + 1;
        const lastPageIndex = Number(prevPages.count) + currentPartPages.length;

        let pages = [];
        if (pagesCount > 0) {
            const getPagesDto = {
                pageFrom: firstPageIndex,
                pageTo: firstPageIndex + pagesCount - 1,
                currentPage: firstPageIndex,
            };
            pages = await this.getPages(getPagesDto, bookId, userId);
        }
        return {
            firstPageIndex,
            lastPageIndex,
            pages,
        };
    }

    async getFreeBookPartsIds(bookId: number) {
        const book = await this.bookRepository.findOne({ where: { id: bookId } });
        const freeBookParts = await this.bookPartRepository
            .createQueryBuilder('bookPart')
            .where('bookPart.bookId = :bookId', { bookId })
            .orderBy('index', 'ASC')
            .limit(book.freeChaptersCount)
            .getMany();

        return freeBookParts.map(part => part.id);
    }
}

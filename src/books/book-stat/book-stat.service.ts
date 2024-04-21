import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { DataSource, In, Repository } from 'typeorm';
import { BookStat } from '../entities/book-stat.entity';
import { BookPageRequest } from '../entities/book-page-request';
import { BooksLibService } from '../books-lib/books-lib.service';
import { UserBooks } from '../entities/user-books.entity';

@Injectable()
export class BookStatService {
    private readonly ReadingPartThreshhold = 0.95;

    constructor(
        @InjectRepository(Book) private bookRepositoty: Repository<Book>,
        @InjectRepository(BookStat) private bookStatRepositoty: Repository<BookStat>,
        @InjectRepository(UserBooks) private userBooksRepository: Repository<UserBooks>,
        @InjectRepository(BookPageRequest)
        private bookPageRequestRepositoty: Repository<BookPageRequest>,
        private bookLibService: BooksLibService,
        private dataSource: DataSource,
    ) {}

    async updateRequestedPages(userId: number, bookId: number, numbers: number[]) {
        this.dataSource.transaction(async entityManager => {
            const pagesInMemory = await this.bookPageRequestRepositoty.find({
                where: { number: In(numbers), bookId, userId },
            });

            const createPromises = [];
            for (const number of numbers) {
                if (!pagesInMemory.some(page => page.number === number)) {
                    createPromises.push(
                        this.bookPageRequestRepositoty.insert({
                            number,
                            bookId,
                            userId,
                        }),
                    );
                }
            }
            await Promise.all(createPromises);

            const book = await this.bookRepositoty.findOne({
                where: { id: bookId },
                relations: ['bookStat'],
            });

            const pagesRequested = pagesInMemory.length + createPromises.length;
            const readingPart = pagesRequested / book.bookStat.pagesCount;

            const bookInfo = await this.bookLibService.getUserBookInfo(bookId, userId);
            bookInfo.readingPart = readingPart;
            if (readingPart >= this.ReadingPartThreshhold && !bookInfo.supposedToBeRead) {
                await this.updateStat(bookId, { readCount: 1 });
                bookInfo.supposedToBeRead = true;
            }
            await this.userBooksRepository.save(bookInfo);
        });
    }

    async updateStat(bookId: number, updateMap: Partial<Record<keyof BookStat, number>>) {
        const book = await this.bookRepositoty.findOne({
            where: { id: bookId },
            relations: ['bookStat'],
        });
        if (!book.bookStat) book.bookStat = new BookStat();
        await this.bookStatRepositoty.save(book.bookStat);

        for (const item in updateMap) {
            book.bookStat[item] += updateMap[item];
        }
        await this.bookRepositoty.save(book);
    }
}

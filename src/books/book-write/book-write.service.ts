import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { DataSource, In, MoreThan, Repository } from 'typeorm';
import { BookGenre } from '../entities/book-genre';
import { BookPart } from '../entities/book-part.entity';
import { BookPage } from '../entities/book-page.entity';
import { UpdateBookMetaDto } from './dto/update-book-meta.dto';
import { BooksLibService } from '../books-lib/books-lib.service';
import { CreatePageDto } from './dto/create-page.dto';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { UpdatePartsOrderDto } from './dto/update-parts-order.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { CreateBookResponse } from './responses/create-book.response';
import { CreatePartResponse } from './responses/create-part.response';
import { CreatePageResponse } from './responses/create-page.response';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BookWriteService {
    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
        @InjectRepository(BookPage) private bookPageRepository: Repository<BookPage>,
        @InjectRepository(BookPart) private bookPartRepository: Repository<BookPart>,
        private bookLibService: BooksLibService,
        private dataSource: DataSource,
        private configService: ConfigService,
    ) {}

    async createBook(userId: number, createBookDto: CreateBookDto): Promise<CreateBookResponse> {
        const genres = await this.bookLibService.findBookGenresByNames(createBookDto.genres ?? []);
        const newBook = this.bookRepository.create({
            title: createBookDto.title,
            description: createBookDto.description,
            cost: createBookDto.cost ?? 0,
            freeChaptersCount: createBookDto.freeChaptersCount,
            ageRestriction: createBookDto.ageRestriction,
            genres: genres,
            authorId: userId,
            coverSrc:
                createBookDto.bookCover &&
                this.configService.get('STATIC_BASE_URL') + createBookDto.bookCover,
        });
        await this.bookRepository.save(newBook);

        return {
            bookId: newBook.id,
        };
    }

    async deleteBook(bookId: number, userId: number) {
        await this.bookRepository.delete({ id: bookId });
    }

    async updateBookMeta(bookId: number, updateBookMetaDto: UpdateBookMetaDto) {
        this.dataSource.transaction(async entityManager => {
            await this.bookRepository.update(
                { id: bookId },
                {
                    title: updateBookMetaDto.title,
                    description: updateBookMetaDto.description,
                    cost: updateBookMetaDto.cost,
                    freeChaptersCount: updateBookMetaDto.freeChaptersCount,
                    ageRestriction: updateBookMetaDto.ageRestriction,
                    coverSrc:
                        updateBookMetaDto.bookCover &&
                        this.configService.get('STATIC_BASE_URL') + updateBookMetaDto.bookCover,
                },
            );

            if (updateBookMetaDto.genres) {
                const newGenres = await this.bookLibService.findBookGenresByNames(
                    updateBookMetaDto.genres ?? [],
                );
                const prevGenres = await this.bookRepository
                    .createQueryBuilder()
                    .relation(Book, 'genres')
                    .of(bookId)
                    .loadMany();

                await this.bookRepository
                    .createQueryBuilder()
                    .relation(Book, 'genres')
                    .of(bookId)
                    .addAndRemove(newGenres, prevGenres);
            }
        });
    }

    async createPart(bookId: number, createPartDto: CreatePartDto): Promise<CreatePartResponse> {
        const lastPart = await this.bookPartRepository.findOne({
            where: { bookId: bookId },
            order: { index: 'DESC' },
        });
        const lastPartIndex = lastPart?.index ?? 0;

        const insertResult = await this.bookPartRepository.insert({
            title: createPartDto.title,
            bookId,
            index: lastPartIndex + 1,
        });

        return {
            partId: insertResult.identifiers[0].id,
        };
    }

    async updatePart(bookPartId: number, updatePartDto: UpdatePartDto) {
        await this.bookPartRepository.update({ id: bookPartId }, { title: updatePartDto.title });
    }

    async updatePartsOrder(updatePartsOrder: UpdatePartsOrderDto) {
        await this.dataSource.transaction(async () => {
            const resetPromises = updatePartsOrder.partsIds.map((partId, index) => {
                return this.bookPartRepository.update({ id: partId }, { index: -1 - index });
            });
            await Promise.all(resetPromises);
            const updatePromises = updatePartsOrder.partsIds.map((partId, index) => {
                return this.bookPartRepository.update(
                    { id: partId },
                    { index: index + updatePartsOrder.partsIds.length + 1 },
                );
            });
            await Promise.all(updatePromises);
        });
    }

    async deletePart(bookPartId: number) {
        await this.bookPartRepository.delete({ id: bookPartId });
    }

    async createPage(bookPartId: number, createPageDto: CreatePageDto): Promise<CreatePageResponse> {
        let newIndex = null;

        if (createPageDto.prevPageId) {
            const prevPage = await this.bookPageRepository.findOne({
                where: { bookPartId, id: createPageDto.prevPageId },
            });
            if (!prevPage) throw new BadRequestException('Invalid prev page id');

            const nextPage = await this.bookPageRepository.findOne({
                where: {
                    bookPartId,
                    index: MoreThan(prevPage.index),
                },
                order: { index: 'ASC' },
            });

            if (!nextPage) {
                newIndex = Number(prevPage.index) + 1;
            } else {
                newIndex = (Number(prevPage.index) + Number(nextPage.index)) / 2;
            }
        } else {
            const lastPage = await this.bookPageRepository.findOne({
                where: { bookPartId },
                order: { index: 'DESC' },
            });
            const lastPageIndex = Number(lastPage?.index ?? 0);
            newIndex = lastPageIndex + 1;
        }

        if (!newIndex) throw new BadRequestException('Invalid data');

        const insertResult = await this.bookPageRepository.insert({
            bookPartId,
            index: newIndex,
        });

        return { pageId: insertResult.identifiers[0].id };
    }

    async updatePage(bookPageId: number, updatePageDto: UpdatePageDto) {
        await this.bookPageRepository.update({ id: bookPageId }, { content: updatePageDto.content });
    }

    async deletePage(bookPageId: number) {
        await this.bookPageRepository.delete({ id: bookPageId });
    }
}

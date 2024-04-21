import { Module } from '@nestjs/common';
import { BookBasicsService } from './book-basics/book-basics.service';
import { BookBasicsController } from './book-basics/book-basics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BookSeries } from './entities/book-series.entity';
import { UserBooks } from './entities/user-books.entity';
import { BookReadService } from './book-read/book-read.service';
import { BooksLibService } from './books-lib/books-lib.service';
import { BookCatalogService } from './book-catalog/book-catalog.service';
import { BookPage } from './entities/book-page.entity';
import { BookPart } from './entities/book-part.entity';
import { BookReadController } from './book-read/book-read.controller';
import { BookWriteController } from './book-write/book-write.controller';
import { BookGenre } from './entities/book-genre.entity';
import { BookAuthorGuard } from './book-write/guards/book-author.guard';
import { BookWriteService } from './book-write/book-write.service';
import { BooksCatalogController } from './book-catalog/book-catalog.controller';
import { BookStat } from './entities/book-stat.entity';
import { BookStatService } from './book-stat/book-stat.service';
import { BookPageRequest } from './entities/book-page-request';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Book,
            BookSeries,
            UserBooks,
            BookPage,
            BookPart,
            BookGenre,
            BookStat,
            BookPageRequest,
        ]),
    ],
    controllers: [BookReadController, BookWriteController, BookBasicsController, BooksCatalogController],
    providers: [
        BookBasicsService,
        BookWriteService,
        BookReadService,
        BookCatalogService,
        BooksLibService,
        BookStatService,
        BookPage,
        BookPart,
        BookAuthorGuard,
    ],
})
export class BooksModule {}

import { Module } from '@nestjs/common';
import { BookBasicsService } from './book-basics/book-basics.service';
import { BookBasicsController } from './book-basics/book-basics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BookSeries } from './entities/book-series.entity';
import { UserBooks } from './entities/user-books.entity';
import { BookWriteService } from './book-write/book-write.service';
import { BookReadService } from './book-read/book-read.service';
import { BooksLibService } from './books-lib/books-lib.service';
import { BookCatalogService } from './book-catalog/book-catalog.service';
import { BookPage } from './entities/book-page.entity';
import { BookPart } from './entities/book-part.entity';
import { BookReadController } from './book-read/book-read.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Book, BookSeries, UserBooks, BookPage, BookPart])],
    controllers: [BookBasicsController, BookReadController],
    providers: [
        BookBasicsService,
        BookWriteService,
        BookReadService,
        BookCatalogService,
        BooksLibService,
        BookPage,
        BookPart,
    ],
})
export class BooksModule {}

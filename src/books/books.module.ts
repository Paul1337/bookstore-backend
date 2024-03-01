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

@Module({
    imports: [TypeOrmModule.forFeature([Book, BookSeries, UserBooks])],
    controllers: [BookBasicsController],
    providers: [
        BookBasicsService,
        BookWriteService,
        BookReadService,
        BookCatalogService,
        BooksLibService,
    ],
})
export class BooksModule {}

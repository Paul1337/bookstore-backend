import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BookSeries } from './entities/book-series.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Book, BookSeries])],
    controllers: [BooksController],
    providers: [BooksService],
})
export class BooksModule {}

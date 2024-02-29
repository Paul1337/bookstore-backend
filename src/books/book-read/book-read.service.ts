import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookReadService {
    constructor(@InjectRepository(Book) private bookRepository: Repository<Book>) {}
}

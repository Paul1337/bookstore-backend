import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

export class ReadBookService {
    constructor(@InjectRepository(Book) private bookRepository: Repository<Book>) {}
}

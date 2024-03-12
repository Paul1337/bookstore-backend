import { Injectable } from '@nestjs/common';
import { SearchBookDto } from './dto/search-book-dto';

@Injectable()
export class BookCatalogService {
    constructor() {}

    async search(searchBook: SearchBookDto) {}
}

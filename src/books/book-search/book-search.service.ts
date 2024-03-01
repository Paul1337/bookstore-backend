import { Injectable } from '@nestjs/common';
import { SearchBookDto } from './dto/search-book-dto';

@Injectable()
export class BookSearch {
    constructor() {}

    async search(searchBook: SearchBookDto) {}
}

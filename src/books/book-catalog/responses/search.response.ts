import { BookGenre } from 'src/books/entities/book-genre.entity';
import { BookStat } from 'src/books/entities/book-stat.entity';
import { BookStatus } from 'src/books/enums/book-status.enum';

export class SearchResponseBook {
    id: number;
    title: string;
    genres: BookGenre[];
    description: string;
    coverSrc?: string;
    bookStat?: BookStat;
    status: BookStatus;
    cost: number;
    freeChaptersCount: number;
}

export class SearchResponse {
    books: Array<SearchResponseBook>;
    pagesCount: number;
}

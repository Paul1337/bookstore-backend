import { Book } from 'src/books/entities/book.entity';

export class GetBookInfoResponse extends Book {
    isStarred: boolean;
    isInLibrary: boolean;
    currentPage: number;
}

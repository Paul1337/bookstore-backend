import { IsOptional } from 'class-validator';
import { BookStatus } from 'src/books/enums/book-status.enum';

export enum SortType {
    New = 'new',
    Raiting = 'raiting',
}

export class SearchBookDto {
    @IsOptional()
    filterTitle?: string;

    @IsOptional()
    genres: string[];

    @IsOptional()
    bookStatus: BookStatus;

    @IsOptional()
    costRange: [number, number];

    @IsOptional()
    sortType: SortType;
}

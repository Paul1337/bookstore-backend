import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { BookStatus } from 'src/books/enums/book-status.enum';

export enum SortType {
    New = 'new',
    Raiting = 'raiting',
}

export class FiltersDto {
    @IsOptional()
    title?: string;

    @IsOptional()
    genres?: string[];

    @IsOptional()
    bookStatus?: BookStatus;

    @IsOptional()
    price?: {
        min: number;
        max: number;
    };
}

export class SearchBookDto {
    @ValidateNested()
    @IsNotEmpty()
    filters: FiltersDto;

    @IsNotEmpty()
    page: number;
}

import { Type } from 'class-transformer';
import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsOptional, ValidateNested } from 'class-validator';

class PagesBetweenDto {
    @IsNotEmpty({ message: 'next page id should not be empty' })
    @IsNumber(undefined, { message: 'next page id is not a number' })
    nextPageId: number;

    @IsNotEmpty({ message: 'prev page id should not be empty' })
    @IsNumber(undefined, { message: 'prev page id is not a number' })
    prevPageId: number;
}

export class CreatePageDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => PagesBetweenDto)
    between?: PagesBetweenDto;
}

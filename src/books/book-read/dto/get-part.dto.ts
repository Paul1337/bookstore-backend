import { IsNumber } from 'class-validator';

export class GetPartDto {
    @IsNumber()
    pagesCount: number;
}

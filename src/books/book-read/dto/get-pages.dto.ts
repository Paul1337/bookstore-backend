import { IsNumber, IsNumberString } from 'class-validator';

export class GetPagesDto {
    @IsNumber()
    currentPage: number;

    @IsNumber()
    pageFrom: number;

    @IsNumber()
    pageTo: number;
}

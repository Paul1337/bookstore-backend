import { IsNumber } from 'class-validator';

export class GetPagesDto {
    @IsNumber()
    pageFrom: number;

    @IsNumber()
    pageTo: number;
}

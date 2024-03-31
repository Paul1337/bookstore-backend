import { IsNumber, IsOptional } from 'class-validator';

export class CreatePageDto {
    @IsOptional()
    @IsNumber()
    prevPageId: number;
}

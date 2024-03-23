import { IsOptional } from 'class-validator';

export class CreatePageDto {
    @IsOptional()
    nextPageId?: number;

    @IsOptional()
    prevPageId?: number;
}

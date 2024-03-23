import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePartDto {
    @IsOptional()
    title?: string;
}

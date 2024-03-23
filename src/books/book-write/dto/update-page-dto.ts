import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePageDto {
    @IsString()
    content: string;
}

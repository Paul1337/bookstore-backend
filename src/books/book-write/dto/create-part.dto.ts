import { IsNotEmpty } from 'class-validator';

export class CreatePartDto {
    @IsNotEmpty()
    title: string;
}

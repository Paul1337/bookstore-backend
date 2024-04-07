import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateBookDto {
    @Length(5, undefined, {
        message: 'Название книги не должно быть короче 5 символов',
    })
    // @IsOptional()
    title: string;

    @IsNotEmpty({
        message: 'Описание не может быть пустым',
    })
    // @IsOptional()
    description: string;

    @IsNumber()
    @IsOptional()
    cost: number;

    @IsNumber()
    @IsOptional()
    freeChaptersCount: number;

    @IsNotEmpty()
    @IsOptional()
    ageRestriction: string;

    @IsOptional()
    genres: string[];

    @IsOptional()
    bookCover?: string;
}

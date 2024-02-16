import { IsNotEmpty, Length } from 'class-validator';

export class LogInUserDto {
    @IsNotEmpty()
    emailOrUsername: string;

    @IsNotEmpty()
    @Length(10)
    password: string;
}

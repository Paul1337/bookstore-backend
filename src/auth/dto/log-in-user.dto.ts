import { IsNotEmpty, Length } from 'class-validator';

export class LogInUserDto {
    @IsNotEmpty()
    usernameOrEmail: string;

    @IsNotEmpty()
    @Length(3)
    password: string;
}

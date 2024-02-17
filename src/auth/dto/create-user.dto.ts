import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'username не указан' })
    username: string;

    @IsEmail({}, { message: 'email некорректный' })
    email: string;

    @Length(8, undefined, { message: 'пароль должен быть от 8 символов длиной' })
    password: string;
}

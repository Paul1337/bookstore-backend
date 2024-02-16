import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'username не указан' })
    username: string;

    @IsEmail({}, { message: 'email некорректный' })
    email: string;

    @Length(10, undefined, { message: 'пароль должен быть от 10 символов длиной' })
    password: string;

    @IsNotEmpty({ message: 'имя не указано' })
    @Length(5, undefined, { message: 'Имя слишком короткое. Минимум 5 символов' })
    firstName: string;

    @IsNotEmpty({ message: 'фамилия не указана' })
    @Length(5, undefined, { message: 'Фамилия слишком короткая. Минимум 5 символов' })
    lastName: string;
}

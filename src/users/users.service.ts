import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    // async findAll() {
    //     return await this.userRepository.find();
    // }

    // async findOne(searchFields: Record<string, string>) {
    //     return this.userRepository.findOne(searchFields);
    // }

    // async createOne(createUserDto: CreateUserDto) {
    //     await this.userRepository.insert({
    //         email: createUserDto.email,
    //         username: createUserDto.username,
    //         firstName: createUserDto.firstName,
    //         lastName: createUserDto.lastName,
    //         password: createUserDto.password,
    //     });
    // }
}

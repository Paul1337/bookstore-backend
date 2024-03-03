import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersLibService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async findById(userId: number) {
        return this.userRepository.findOne({ where: { id: userId } });
    }

    async findWithProfileById(userId: number) {
        return this.userRepository.findOne({ where: { id: userId }, relations: ['profile'] });
    }
}

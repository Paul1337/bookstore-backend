import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetProfileResponse } from './responses/get-profile.response';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async findById(userId: number) {
        return this.userRepository.findOne({ where: { id: userId } });
    }

    async getProfile(userId: number): Promise<GetProfileResponse> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles', 'writtenBooks', 'profile'],
        });

        return {
            profile: user.profile,
            email: user.email,
            firstName: user.firstName,
            isBanned: user.isBanned,
            lastName: user.lastName,
            roles: user.roles.map(userRole => userRole.name) as Role[],
            username: user.username,
            writtenBooks: user.writtenBooks,
        };
    }

    async updateUserImg(userId: number, userImg: string) {
        await this.userRepository
            .createQueryBuilder()
            .relation(User, 'profile')
            .of(userId)
            .update({
                profile: { userImg },
            })
            .execute();
    }

    async updateBackgroundImg(userId: number, backgroundImg: string) {
        await this.userRepository
            .createQueryBuilder()
            .relation(User, 'profile')
            .of(userId)
            .update({
                profile: { backgroundImg },
            })
            .execute();
    }
}

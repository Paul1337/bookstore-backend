import { Injectable } from '@nestjs/common';
import { GetProfileResponse } from './responses/get-profile.response';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/auth/enums/role.enum';
import { UsersLibService } from '../lib/users-lib.service';

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private userLibService: UsersLibService,
    ) {}

    async getProfile(userId: number): Promise<GetProfileResponse> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles', 'writtenBooks', 'profile'],
        });

        return {
            profile: user.profile,
            email: user.email,
            roles: user.roles.map(userRole => userRole.name) as Role[],
            username: user.username,
            writtenBooks: user.writtenBooks,
            isBanned: user.isBanned,
        };
    }

    async updateUserImg(userId: number, userImg: string) {
        const user = await this.userLibService.findWithProfileById(userId);
        user.profile.userImg = userImg;
        await this.userRepository.save(user);
    }

    async updateBackgroundImg(userId: number, backgroundImg: string) {
        const user = await this.userLibService.findWithProfileById(userId);
        user.profile.backgroundImg = backgroundImg;
        await this.userRepository.save(user);
    }
}

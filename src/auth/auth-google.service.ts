import { Injectable } from '@nestjs/common';
import { UserPayloadScheme } from './lib/request-extension';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/users/entities/user-role.entity';
import { UserProfile } from 'src/users/entities/user-profile.entity';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthGoogleService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserRole) private userRoleRepository: Repository<UserRole>,
        @InjectRepository(UserProfile) private userProfileRepository: Repository<UserProfile>,
    ) {}

    async googleAuthUser(userPayload: UserPayloadScheme) {
        // 1. select that user from database
        // 2.1 if no -> we should create user
        // 2.2 if found -> nothing to create
        // anyway we generate jwt token

        const user = await this.userRepository.findOne({
            where: { google_id: userPayload.id.toString() },
        });
        if (!user) {
            const userRole = await this.userRoleRepository.findOne({ where: { name: Role.User } });
            // const userProfile = await this.userProfileRepository.create({});
            await this.userRepository.insert({
                google_id: userPayload.id.toString(),
                email: userPayload.email,
                username: userPayload.username,
                roles: [userRole],
                // profile: userProfile,
            });
        }

        return {
            jwtToken: await this.jwtService.signAsync(userPayload),
        };
    }
}

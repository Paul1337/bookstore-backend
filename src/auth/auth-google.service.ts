import { Injectable } from '@nestjs/common';
import { GoogleUserScheme, UserPayloadScheme } from './lib/request-extension';
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
    ) {}

    async googleAuthUser(googleUser: GoogleUserScheme) {
        console.log('google user', googleUser);
        let user = await this.userRepository.findOne({
            where: { googleId: googleUser.googleId },
            relations: ['roles'],
        });

        if (!user) {
            const userRole = await this.userRoleRepository.findOne({ where: { name: Role.User } });
            user = this.userRepository.create({
                googleId: googleUser.googleId,
                email: googleUser.email,
                username: googleUser.username,
                roles: [userRole],
            });
            await this.userRepository.save(user);
        }

        return {
            jwtToken: await this.jwtService.signAsync({
                email: user.email,
                id: user.id,
                roles: user.roles.map(role => role.name) as Role[],
                username: user.username,
            } as UserPayloadScheme),
        };
    }
}

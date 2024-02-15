import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInUserDto } from './dto/log-in-user.dto';
import { UserPayloadScheme } from './lib/request-extension';
import { Role } from './enums/role.enum';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserRoles } from 'src/users/entities/user-roles.entity';
import { UserRole } from 'src/users/entities/user-role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserRoles) private userRolesRepository: Repository<UserRoles>,
        @InjectRepository(UserRole) private roleRepositor: Repository<UserRole>,
    ) {}

    async logIn(loginUserDto: LogInUserDto) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect(UserRoles, 'userRole', 'userRole.userId = user.id')
            .leftJoinAndSelect(UserRole, 'role', 'role.id = userRole.roleId')
            .where('user.username = :value or user.email = :value', {
                value: loginUserDto.usernameOrEmail,
            })
            .getOne();

        if (!user) {
            throw new ForbiddenException(`User not found`);
        }

        if (!bcrypt.compareSync(loginUserDto.password, user.password)) {
            throw new ForbiddenException('Password is not correct');
        }

        const payload: UserPayloadScheme = {
            email: user.email,
            username: user.username,
            id: user.id,
            roles: user.roles,
        };

        return {
            authToken: await this.jwtService.signAsync(payload),
            userData: payload,
        };
    }

    async register(createUserDto: CreateUserDto) {
        const users = await this.userRepository
            .createQueryBuilder('user')
            .where('user.username = :username or user.email = :email', {
                username: createUserDto.username,
                email: createUserDto.email,
            })
            .getMany();
        if (users[0]) {
            const err =
                users[0].username === createUserDto.username
                    ? `Пользователь с username ${createUserDto.username} уже существует`
                    : `Пользователь с email ${createUserDto.email} уже существует`;
            throw new BadRequestException([err]);
        }

        createUserDto.password = bcrypt.hashSync(createUserDto.password, 5);
        const insertResult = await this.userRepository.insert({
            email: createUserDto.email,
            username: createUserDto.username,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            password: createUserDto.password,
        });
        await this.userRolesRepository.insert({
            roleId: 0, // user role is the first, maybe something better to put here :)
            userId: insertResult.identifiers[0].id,
        });
        return {
            message: 'ok',
        };
    }

    extractAuthTokenFromHeader(authHeader: string): string | undefined {
        const [type, token] = authHeader?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async verifyToken(token: string): Promise<UserPayloadScheme> {
        try {
            const payload = await this.jwtService.verifyAsync(token);
            return payload;
        } catch (err) {
            console.log(err);
            throw new UnauthorizedException();
        }
    }
}

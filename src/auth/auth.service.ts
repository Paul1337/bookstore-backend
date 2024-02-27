import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInUserDto } from './dto/log-in-user.dto';
import { Role } from './enums/role.enum';
import { UserPayloadScheme } from './lib/request-extension';
import { UserRole } from 'src/users/entities/role';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserRole) private UserRoleRepository: Repository<UserRole>,
    ) {}

    async logIn(loginUserDto: LogInUserDto) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'UserRole')
            .where('user.username = :value or user.email = :value', {
                value: loginUserDto.emailOrUsername,
            })
            .getOne();

        if (!user) {
            throw new ForbiddenException(`Пользователь не найден`);
        }

        if (!bcrypt.compareSync(loginUserDto.password, user.password)) {
            throw new ForbiddenException('Пароль неверный');
        }

        const payload: UserPayloadScheme = {
            email: user.email,
            username: user.username,
            id: user.id,
            roles: user.roles.map(UserRole => UserRole.name) as Role[],
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
            throw new BadRequestException(err);
        }

        const passwordHash = bcrypt.hashSync(createUserDto.password, 5);

        const newUser = new User();
        newUser.email = createUserDto.email;
        newUser.username = createUserDto.username;
        newUser.password = passwordHash;

        const basicUserRole = await this.UserRoleRepository.findOne({ where: { name: Role.User } });
        newUser.roles = [basicUserRole];

        await this.userRepository.save(newUser);

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

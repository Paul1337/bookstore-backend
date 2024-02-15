import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoles } from './entities/user-roles.entity';
import { UserRole } from './entities/user-role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserRoles, UserRole])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}

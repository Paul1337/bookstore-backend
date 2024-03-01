import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './entities/user-role.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserProfile } from './entities/user-profile.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserRole, UserProfile])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}

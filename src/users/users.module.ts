import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './entities/user-role.entity';
import { User } from './entities/user.entity';
import { UsersLibService } from './lib/users-lib.service';
import { UserProfile } from './entities/user-profile.entity';
import { UserProfileController } from './user-profile/user-profile.controller';
import { UserProfileService } from './user-profile/user-profile.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserRole, UserProfile])],
    providers: [UsersLibService, UserProfileService],
    controllers: [UserProfileController],
    exports: [TypeOrmModule],
})
export class UsersModule {}

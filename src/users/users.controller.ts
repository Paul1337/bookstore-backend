import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { RequestExtended } from 'src/auth/lib/request-extension';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('profile')
    async getUserProfile(@Req() req: RequestExtended) {
        // return this.usersService.getUserProfile(req.user.id);
    }
}

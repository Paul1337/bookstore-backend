import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    // @Get('profile')
    // async getUserProfile(@Req() req: RequestExtended) {
    // return this.usersService.getUserProfile(req.user.id);
    // }
}

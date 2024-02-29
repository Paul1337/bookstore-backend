import { Body, Controller, Post, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInUserDto } from './dto/log-in-user.dto';
import { RequestExtended } from './lib/request-extension';
import { Roles } from './decorators/roles.decorator';
import { AllRoles } from './enums/role.enum';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    @Public()
    async logIn(@Body() logInDto: LogInUserDto) {
        return this.authService.logIn(logInDto);
    }

    @Post('/reg')
    @Public()
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('/me')
    @Roles(...AllRoles)
    async init(@Req() req: RequestExtended) {
        if (req['user']) {
            return req['user'];
        }
        throw new UnauthorizedException();
    }
}

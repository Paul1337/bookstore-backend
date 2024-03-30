import {
    Body,
    Controller,
    Get,
    Post,
    Redirect,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInUserDto } from './dto/log-in-user.dto';
import { RequestExtended, RequestWithGoogle } from './lib/request-extension';
import { Roles } from './decorators/roles.decorator';
import { AllRoles } from './enums/role.enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthGoogleService } from './auth-google.service';
import passport from 'passport';
import { Response } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly authGoogleService: AuthGoogleService,
    ) {}

    @Post('/login')
    @Public()
    @ApiOperation({
        summary: 'Вход пользователя',
    })
    async logIn(@Body() logInDto: LogInUserDto) {
        return this.authService.logIn(logInDto);
    }

    @Post('/reg')
    @Public()
    @ApiOperation({
        summary: 'Регистрация пользователя',
    })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Get('/me')
    @Roles(...AllRoles)
    @ApiOperation({
        summary: 'Получение первичных данных пользователя, если неавторизован - вернёт ошибку',
    })
    async getMe(@Req() req: RequestExtended) {
        if (req['user']) {
            return req['user'];
        }
        throw new UnauthorizedException();
    }

    @Get('google')
    @Public()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: RequestExtended) {
        console.log('req', req);
    }

    @Get('google/redirect')
    @Public()
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: RequestWithGoogle, @Res() res: Response) {
        const { jwtToken } = await this.authGoogleService.googleAuthUser(req.googleUser);
        return res.redirect(`http://localhost:5173/?jwtToken=${jwtToken}`);
    }
}

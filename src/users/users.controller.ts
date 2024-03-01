import { Controller, Get, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestExtended } from 'src/auth/lib/request-extension';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AllRoles } from 'src/auth/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('profile')
    @Roles(...AllRoles)
    @ApiOperation({
        summary: 'Получение подробной информации о профиле текущего пользователя',
    })
    async getProfile(@Req() req: RequestExtended) {
        return this.usersService.getProfile(req.user.id);
    }

    @Post('uploadUserImg')
    @ApiOperation({
        summary: 'Загрузить фотографию профиля пользователя',
    })
    @UseInterceptors(FileInterceptor('file', { dest: '../static/uploads' }))
    async uploadUserImage(@Req() req: RequestExtended, @UploadedFile() userImg: Express.Multer.File) {
        console.log('uploaded user image', userImg);
        const correctedPath = userImg.path.substring(userImg.path.indexOf('/'));
        console.log('corrected image path', correctedPath);
        await this.usersService.updateUserImg(req.user.id, correctedPath);
        return { userImg: correctedPath };
    }

    @Post('uploadUserImg')
    @ApiOperation({
        summary: 'Загрузить фотографию фона профиля',
    })
    @UseInterceptors(FileInterceptor('file', { dest: '../static/uploads' }))
    async uploadBackgroundImage(
        @Req() req: RequestExtended,
        @UploadedFile() backgroundImg: Express.Multer.File,
    ) {
        console.log('uploaded user image', backgroundImg);
        const correctedPath = backgroundImg.path.substring(backgroundImg.path.indexOf('/'));
        console.log('corrected image path', correctedPath);
        await this.usersService.updateBackgroundImg(req.user.id, correctedPath);
        return { userImg: correctedPath };
    }
}

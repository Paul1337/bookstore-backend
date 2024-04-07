import { Controller, Get, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestExtended } from 'src/auth/lib/request-extension';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AllRoles } from 'src/auth/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserProfileService } from './user-profile.service';

@Controller('users/profile')
@ApiTags('users-profile')
export class UserProfileController {
    constructor(private userProfileService: UserProfileService) {}

    @Get('/')
    @Roles(...AllRoles)
    @ApiOperation({
        summary: 'Получение подробной информации о профиле текущего пользователя',
    })
    async getProfile(@Req() req: RequestExtended) {
        return this.userProfileService.getProfile(req.user.id);
    }

    @Post('uploadUserImage')
    @ApiOperation({
        summary: 'Загрузить фотографию профиля пользователя',
    })
    @UseInterceptors(
        FileInterceptor('image', {
            dest: './static/uploads',
            limits: { fileSize: 100 * 1024 * 1024 },
        }),
    )
    async uploadUserImage(@Req() req: RequestExtended, @UploadedFile() userImg: Express.Multer.File) {
        const correctedPath = userImg.path.substring(userImg.path.indexOf('/uploads'));
        await this.userProfileService.updateUserImg(req.user.id, correctedPath);
        return { userImg: correctedPath };
    }

    @Post('uploadBackgroundImage')
    @ApiOperation({
        summary: 'Загрузить фотографию фона профиля',
    })
    @UseInterceptors(
        FileInterceptor('image', {
            dest: './static/uploads',
            limits: { fileSize: 100 * 1024 * 1024 },
        }),
    )
    async uploadBackgroundImage(
        @Req() req: RequestExtended,
        @UploadedFile() backgroundImg: Express.Multer.File,
    ) {
        const correctedPath = backgroundImg.path.substring(backgroundImg.path.indexOf('/uploads'));
        await this.userProfileService.updateBackgroundImg(req.user.id, correctedPath);
        return { userImg: correctedPath };
    }
}

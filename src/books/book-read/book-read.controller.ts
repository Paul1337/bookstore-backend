import { Body, Controller, Get, Injectable, Param, ParseIntPipe, Query, Req } from '@nestjs/common';
import { BookReadService } from './book-read.service';
import { ApiOkResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { GetPagesDto } from './dto/get-pages.dto';
import { RequestExtended } from 'src/auth/lib/request-extension';
import { GetPageResponse } from './responses/get-pages.response';

@Controller('books')
@ApiTags('book-read')
export class BookReadController {
    constructor(private bookReadService: BookReadService) {}

    @Get(':bookId/pages')
    @Public()
    // @ApiOperation({
    //     summary: 'Получение диапазона страниц определённой книги',
    //     description:
    //         'Если какие-то страницы из диапазона не доступны пользователю, они не будут возвращены.',
    // })
    // @ApiOkResponse({
    // schema: GetPageResponse,
    // isArray: true,
    // })
    async getPages(
        @Query() getPagesDto: GetPagesDto,
        @Param('bookId') bookId: number,
        @Req() req: RequestExtended,
    ) {
        const userId = req.user?.id;
        if (userId) {
            return this.bookReadService.getPagesPrivate(getPagesDto, bookId, userId);
        } else {
            return this.bookReadService.getPagesPublic(getPagesDto, bookId);
        }
    }
}

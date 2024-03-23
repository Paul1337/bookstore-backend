import { Body, Controller, Get, Injectable, Param, ParseIntPipe, Query, Req } from '@nestjs/common';
import { BookReadService } from './book-read.service';
import { ApiOkResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { GetPagesDto } from './dto/get-pages.dto';
import { RequestExtended } from 'src/auth/lib/request-extension';
import { GetPageResponse } from './responses/get-pages.response';
import { GetPartDto } from './dto/get-part.dto';

@Controller('books')
@ApiTags('book-read')
export class BookReadController {
    constructor(private bookReadService: BookReadService) {}

    @Get(':bookId/pages')
    @Public()
    @ApiOperation({
        summary: 'Получение диапазона страниц определённой книги, с указанием активной страницы',
        description:
            'Если какие-то страницы из диапазона не доступны пользователю, они не будут возвращены.',
    })
    async getPages(
        @Query() getPagesDto: GetPagesDto,
        @Param('bookId') bookId: number,
        @Req() req: RequestExtended,
    ) {
        return this.bookReadService.getPages(getPagesDto, bookId, req.user?.id);
    }

    @Get(':bookId/part/:bookPartId')
    @Public()
    @ApiOperation({
        summary: 'Получение информации о главе и несколько первых страниц',
        description: 'Если глава не доступна пользователю, вернёт ошибку.',
    })
    async getBookPart(
        @Query() getPartDto: GetPartDto,
        @Param('bookPartId') bookPartId: number,
        @Param('bookId') bookId: number,
        @Req() req: RequestExtended,
    ) {
        return this.bookReadService.getPart(getPartDto, bookId, bookPartId, req.user?.id);
    }
}

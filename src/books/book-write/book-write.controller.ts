import { Body, Controller, Delete, Injectable, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RequestExtended } from 'src/auth/lib/request-extension';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookMetaDto } from './dto/update-book-meta.dto';
import { BookAuthorGuard } from './guards/book-author.guard';
import { CreatePartDto } from './dto/create-part.dto';
import { PartAuthorGuard } from './guards/part-author.guard';
import { BookWriteService } from './book-write.service';
import { UpdatePartDto } from './dto/update-part.dto';
import { UpdatePartsOrderDto } from './dto/update-parts-order.dto';
import { CreatePageDto } from './dto/create-page.dto';
import { PageAuthorGuard } from './guards/page-author.guard';
import { UpdatePageDto } from './dto/update-page-dto';
import { UpdatePartsOrderGuard } from './guards/update-parts-order.guard';

@Controller('books/write')
@ApiTags('book-write')
export class BookWriteController {
    constructor(private bookWriteService: BookWriteService) {}

    @Post()
    @ApiOperation({
        summary: 'Создание книги',
        description:
            'Создание книги от имени текущего пользователя. Этот пользователь становится автором книги. Необходима аутентификация',
    })
    @Roles(Role.User)
    async createBook(@Req() req: RequestExtended, @Body() createBookDto: CreateBookDto) {
        return this.bookWriteService.createBook(req.user.id, createBookDto);
    }

    @Post(':bookId/edit')
    @ApiOperation({
        summary: 'Обновление мета информации о книге',
        description:
            'Редактирование информации о книги. Необходима аутентификация, пользователь должен быть автором этой книги',
    })
    @Roles(Role.User)
    @UseGuards(BookAuthorGuard)
    async updateBookMeta(@Body() updateBookMeta: UpdateBookMetaDto, @Param('bookId') bookId: number) {
        return this.bookWriteService.updateBookMeta(bookId, updateBookMeta);
    }

    @Delete(':bookId')
    @ApiOperation({
        summary: 'Удаление книги',
        description:
            'Полное безвозвратное удаление книги, всех связанных частей и страниц. Необходима аутентификация, пользователь должен быть автором этой книги',
    })
    @Roles(Role.User)
    @UseGuards(BookAuthorGuard)
    async deleteBook(@Req() req: RequestExtended, @Param('bookId') bookId: number) {
        return this.bookWriteService.deleteBook(bookId, req.user.id);
    }

    @Post(':bookId/parts')
    @ApiOperation({
        summary: 'Создание главы',
    })
    @Roles(Role.User)
    @UseGuards(BookAuthorGuard)
    async createPart(@Param('bookId') bookId: number, @Body() createPartDto: CreatePartDto) {
        return this.bookWriteService.createPart(bookId, createPartDto);
    }

    @Post('parts/:bookPartId')
    @Roles(Role.User)
    @UseGuards(PartAuthorGuard)
    @ApiOperation({
        summary: 'Обновление главы',
    })
    async updatePart(@Param('bookPartId') bookPartId: number, @Body() updatePartDto: UpdatePartDto) {
        return this.bookWriteService.updatePart(bookPartId, updatePartDto);
    }

    @Post('parts/order')
    @Roles(Role.User)
    @UseGuards(UpdatePartsOrderGuard)
    @ApiOperation({
        summary: 'Обновление порядка глав',
    })
    async updatePartsOrder(updatePartsOrderDto: UpdatePartsOrderDto) {
        return this.bookWriteService.updatePartsOrder(updatePartsOrderDto);
    }

    @Delete('parts/:bookPartId')
    @Roles(Role.User)
    @UseGuards(PartAuthorGuard)
    @ApiOperation({
        summary: 'Удаление главы',
    })
    async deletePart(@Param('bookPartId') bookPartId: number) {
        return this.bookWriteService.deletePart(bookPartId);
    }

    @Post('pages/:bookPageId')
    @Roles(Role.User)
    @UseGuards(PageAuthorGuard)
    @ApiOperation({
        summary: 'Обновление страницы',
    })
    async updatePage(@Param('bookPageId') bookPageId: number, @Body() updatePageDto: UpdatePageDto) {
        return this.bookWriteService.updatePage(bookPageId, updatePageDto);
    }

    @Post(':bookPartId/pages')
    @ApiOperation({
        summary: 'Создание страницы',
    })
    @Roles(Role.User)
    @UseGuards(PartAuthorGuard)
    async createPage(@Param('bookPartId') bookPartId: number, @Body() createPageDto: CreatePageDto) {
        return this.bookWriteService.createPage(bookPartId, createPageDto);
    }

    @Delete('pages/:bookPageId')
    @Roles(Role.User)
    @UseGuards(PageAuthorGuard)
    @ApiOperation({
        summary: 'Удаление страницы',
    })
    async deletePage(@Param('bookPageId') bookPageId: number) {
        return this.bookWriteService.deletePage(bookPageId);
    }
}

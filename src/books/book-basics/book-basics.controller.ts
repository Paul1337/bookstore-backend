import { Controller, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RequestExtended } from 'src/auth/lib/request-extension';
import { BookBasicsService } from './book-basics.service';
import { GetMyLibraryResponse } from './responses/get-my-library.response';

@Controller('books')
@ApiTags('books-basics')
export class BookBasicsController {
    constructor(private readonly bookBasicsService: BookBasicsService) {}

    @Get('myLibrary')
    @Roles(Role.User)
    @ApiOperation({
        summary: 'Получение списка книг в библиотеке пользователя',
    })
    async getMyLibrary(@Req() request: RequestExtended) {
        return this.bookBasicsService.getMyLibrary(request.user.id);
    }

    @Get(':bookId')
    @Public()
    @ApiOperation({
        summary: 'Получение общей информации о книги. Для авторизованных пользователей доп информация.',
    })
    async getBookInfo(
        @Req() request: RequestExtended,
        @Param('bookId', new ParseIntPipe()) bookId: number,
    ) {
        if (request.user) {
            return this.bookBasicsService.getBookPrivateInfo(bookId, request.user.id);
        } else {
            return this.bookBasicsService.getBookPublicInfo(bookId);
        }
    }

    @Post(':bookId/star')
    @Roles(Role.User)
    @ApiOperation({
        summary: 'Оценивание (лайк) книги',
    })
    async starBook(
        @Req() request: RequestExtended,
        @Param('bookId', new ParseIntPipe()) bookId: number,
    ) {
        return this.bookBasicsService.starBook(bookId, request.user.id);
    }

    @Post(':bookId/unstar')
    @Roles(Role.User)
    @ApiOperation({
        summary: 'Отмена оценивания (лайка) книги',
    })
    async unstarBook(
        @Req() request: RequestExtended,
        @Param('bookId', new ParseIntPipe()) bookId: number,
    ) {
        return this.bookBasicsService.unstarBook(bookId, request.user.id);
    }

    @Post(':bookId/addToLibrary')
    @Roles(Role.User)
    @ApiOperation({
        summary: 'Добавление в библиотеку пользователя',
    })
    async addToLibrary(
        @Req() request: RequestExtended,
        @Param('bookId', new ParseIntPipe()) bookId: number,
    ) {
        return this.bookBasicsService.addBookToLibrary(bookId, request.user.id);
    }

    @Post(':bookId/removeFromLibrary')
    @Roles(Role.User)
    @ApiOperation({
        summary: 'Удаление из библиотеки пользователя',
    })
    async removeFromLibrary(
        @Req() request: RequestExtended,
        @Param('bookId', new ParseIntPipe()) bookId: number,
    ) {
        return this.bookBasicsService.removeBookFromLibrary(bookId, request.user.id);
    }

    // @Post('search')
    // @Public()
    // @ApiBody({ type: SearchBookDto })
    // // @ApiResponse({ type: SearchBookDto })
    // async searchBook(@Req() request: RequestExtended, @Body() searchBookDto: SearchBookDto) {
    //     // const userId = request.user?.id;
    //     // if (userId) {
    //     //     // some pattern for private users (we can search accroding to specific user parametrs)
    //     // } else {
    //     //     // some common search pattern
    //     // }
    // }
}

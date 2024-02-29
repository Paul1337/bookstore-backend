import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RequestExtended } from 'src/auth/lib/request-extension';
import { BookBasicsService } from './book-basics.service';

@Controller('books')
@ApiTags('books-basics')
export class BookBasicsController {
    constructor(private readonly bookBasicsService: BookBasicsService) {}

    @Get(':bookId')
    @Public()
    async getBookInfo(@Req() request: RequestExtended, @Param('bookId') bookId) {
        if (request.user) {
            return this.bookBasicsService.getBookPrivateInfo(bookId, request.user.id);
        } else {
            return this.bookBasicsService.getBookPublicInfo(bookId);
        }
    }

    @Post(':bookId/star')
    @Roles(Role.User)
    async starBook(@Req() request: RequestExtended, @Param('bookId') bookId) {
        return this.bookBasicsService.starBook(bookId, request.user.id);
    }

    @Post(':bookId/unstar')
    @Roles(Role.User)
    async unstarBook(@Req() request: RequestExtended, @Param('bookId') bookId) {
        return this.bookBasicsService.unstarBook(bookId, request.user.id);
    }

    @Post(':bookId/addToLibrary')
    @Roles(Role.User)
    async addToLibrary(@Req() request: RequestExtended, @Param('bookId') bookId) {
        return this.bookBasicsService.addBookToLibrary(bookId, request.user.id);
    }

    @Post(':bookId/removeFromLibrary')
    @Roles(Role.User)
    async removeFromLibrary(@Req() request: RequestExtended, @Param('bookId') bookId) {
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

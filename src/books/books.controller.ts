import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { BooksService } from './books.service';
import { RequestExtended } from 'src/auth/lib/request-extension';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { SearchBookDto } from './dto/search-book-dto';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Get(':bookId')
    @Public()
    async getBook(@Req() request: RequestExtended, @Param('bookId') bookId) {}

    @Post(':bookId/like')
    @Roles(Role.User)
    async likeBook(@Req() request: RequestExtended) {
        const userId = request.user?.id;
    }

    @Post('search')
    @Public()
    async searchBook(@Req() request: RequestExtended, @Body() searchBookDto: SearchBookDto) {
        const userId = request.user?.id;
        if (userId) {
            // some pattern for private users (we can search accroding to specific user parametrs)
        } else {
            // some common search pattern
        }
    }
}

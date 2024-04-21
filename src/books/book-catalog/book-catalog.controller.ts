import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookCatalogService } from './book-catalog.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { SearchBookDto } from './dto/search-book-dto';

@Controller('books')
export class BooksCatalogController {
    constructor(private bookCatalogService: BookCatalogService) {}

    @Get('category/top')
    @Public()
    async getTop() {
        return this.bookCatalogService.getTopBooks();
    }

    @Get('category/new')
    @Public()
    async getNew() {
        return this.bookCatalogService.getNewBooks();
    }

    @Get('category/relevant')
    @Public()
    async getRelevant() {
        return this.bookCatalogService.getRelevantBooks();
    }

    @Post('search')
    @Public()
    async search(@Body() searchBookDto: SearchBookDto) {
        return this.bookCatalogService.search(searchBookDto);
    }
}

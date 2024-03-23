import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestExtended } from 'src/auth/lib/request-extension';
import { BookPage } from 'src/books/entities/book-page.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PageAuthorGuard implements CanActivate {
    constructor(@InjectRepository(BookPage) private bookPageRepository: Repository<BookPage>) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as RequestExtended;
        const { bookPageId } = request.params;

        const bookPage = await this.bookPageRepository
            .createQueryBuilder('bookPage')
            .leftJoinAndSelect('bookPage.part', 'bookPart')
            .leftJoinAndSelect('bookPart.book', 'book')
            .getOne();

        if (!bookPage || bookPage.bookPart.book.authorId !== request.user.id)
            throw new ForbiddenException(`You don't have permission to manage that book page`);

        return true;
    }
}

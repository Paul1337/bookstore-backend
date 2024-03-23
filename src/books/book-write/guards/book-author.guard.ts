import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { RequestExtended } from 'src/auth/lib/request-extension';
import { Book } from 'src/books/entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookAuthorGuard implements CanActivate {
    constructor(@InjectRepository(Book) private bookRepository: Repository<Book>) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as RequestExtended;
        const { bookId } = request.params;

        const book = await this.bookRepository.findOne({
            where: { id: Number(bookId), authorId: Number(request.user.id) },
        });

        if (!book) throw new ForbiddenException(`You don't have permission to manage that book`);
        return true;
    }
}

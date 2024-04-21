import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestExtended } from 'src/auth/lib/request-extension';
import { Book } from 'src/books/entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CanPublishBookGuard implements CanActivate {
    constructor(@InjectRepository(Book) private bookRepository: Repository<Book>) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as RequestExtended;
        const { bookId } = request.params;
        const userId = request.user.id;

        const book = await this.bookRepository.findOne({ where: { id: Number(bookId) } });
        if (book.authorId !== userId)
            throw new ForbiddenException(`You don't have permission to manage that book`);

        return true;
    }
}

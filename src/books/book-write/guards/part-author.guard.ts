import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestExtended } from 'src/auth/lib/request-extension';
import { BookPart } from 'src/books/entities/book-part.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartAuthorGuard implements CanActivate {
    constructor(@InjectRepository(BookPart) private bookPartRepository: Repository<BookPart>) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as RequestExtended;
        const { bookPartId } = request.params;

        const bookPart = await this.bookPartRepository.findOne({
            where: { id: Number(bookPartId) },
            relations: ['book'],
        });

        if (!bookPart || bookPart.book.authorId !== request.user.id)
            throw new ForbiddenException(`You don't have permission to manage that book part`);

        return true;
    }
}

import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { RequestExtended } from 'src/auth/lib/request-extension';
import { BookPart } from 'src/books/entities/book-part.entity';
import { Repository } from 'typeorm';
import { UpdatePartsOrderDto } from '../dto/update-parts-order.dto';

export class UpdatePartsOrderGuard implements CanActivate {
    constructor(@InjectRepository(BookPart) private bookPartRepository: Repository<BookPart>) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as RequestExtended;

        const updatePartsOrderDto = request.body as UpdatePartsOrderDto;

        for (const part of updatePartsOrderDto.parts) {
            const { id: bookPartId } = part;

            const bookPart = await this.bookPartRepository.findOne({
                where: { id: bookPartId },
                relations: ['book'],
            });

            if (!bookPart || bookPart.book.authorId !== request.user.id)
                throw new ForbiddenException(`You don't have permission to manage that book part`);
        }

        return true;
    }
}

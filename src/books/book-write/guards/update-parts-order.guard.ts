import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
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

        const { bookId } = request.params;
        const updatePartsOrderDto = request.body as UpdatePartsOrderDto;
        const realBookParts = await this.bookPartRepository.find({ where: { bookId: Number(bookId) } });

        if (updatePartsOrderDto.partsIds.length !== realBookParts.length) {
            throw new BadRequestException('Number of parts ids should equal to number of book parts');
        }

        const forbiddenPartId = updatePartsOrderDto.partsIds.find(partId =>
            realBookParts.every(bookPart => bookPart.id !== partId),
        );

        if (forbiddenPartId) {
            throw new ForbiddenException(
                `Part with id ${forbiddenPartId} is not from the book ${bookId}!`,
            );
        }

        return true;
    }
}

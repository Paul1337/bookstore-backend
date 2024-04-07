import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Length } from 'class-validator';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookMetaDto extends PartialType(CreateBookDto) {}

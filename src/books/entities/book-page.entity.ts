import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BookPart } from './book-part.entity';
import { Book } from './book.entity';

@Entity()
@Unique(['index', 'bookPart'])
export class BookPage {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @Column({ type: 'text', default: '' })
    content: string;

    @Column({ type: 'numeric' })
    @Index()
    index: number;

    @ManyToOne(type => BookPart, part => part.pages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'book_part_id' })
    bookPart: BookPart;

    @Column({ type: 'int4' })
    bookPartId: number;
}

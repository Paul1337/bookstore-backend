import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BookPart } from './book-part.entity';
import { Book } from './book.entity';

@Entity()
@Unique(['index', 'bookId'])
export class BookPage {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'int4' })
    index: number;

    @ManyToOne(type => BookPart)
    @JoinColumn({ name: 'book_part_id' })
    bookPart: BookPart;

    @Column({ type: 'int4' })
    bookPartId: number;

    @ManyToOne(type => Book)
    @JoinColumn({ name: 'book_id' })
    book: Book;

    @Column({ type: 'int4' })
    bookId: number;
}

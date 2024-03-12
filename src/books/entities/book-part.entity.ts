import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class BookPart {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @Column({ type: 'varchar', length: 128 })
    title: string;

    @Column({ type: 'int4' })
    index: number;

    @ManyToOne(type => Book)
    @JoinColumn({ name: 'book_id' })
    book: Book;

    @Column({ type: 'int4' })
    bookId: number;
}

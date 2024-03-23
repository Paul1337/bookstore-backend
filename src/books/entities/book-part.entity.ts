import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Book } from './book.entity';
import { BookPage } from './book-page.entity';

@Entity()
@Unique(['index', 'bookId'])
export class BookPart {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @Column({ type: 'varchar', length: 128 })
    title: string;

    @Column({ type: 'numeric' })
    index: number;

    @ManyToOne(type => Book, book => book.parts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'book_id' })
    book: Book;

    @OneToMany(() => BookPage, page => page.bookPart, { cascade: ['remove'] })
    pages: BookPage[];

    @Column({ type: 'int4' })
    bookId: number;
}

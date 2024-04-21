import { User } from 'src/users/entities/user.entity';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class BookPageRequest {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @Index()
    @JoinColumn()
    @ManyToOne(() => User)
    user: User;

    @Column('int4')
    userId: number;

    @Index()
    @JoinColumn()
    @ManyToOne(() => Book)
    book: Book;

    @Column('int4')
    bookId: number;

    @Column({ type: 'int4' })
    @Index()
    number: number;
}

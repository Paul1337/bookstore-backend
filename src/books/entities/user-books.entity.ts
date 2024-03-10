import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';

@Entity()
export class UserBooks {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @ManyToOne(type => User)
    @JoinColumn()
    user: User;

    @Column({ type: 'int4' })
    user_id: number;

    @ManyToOne(type => Book)
    @JoinColumn()
    book: Book;

    @Column({ type: 'int4' })
    book_id: number;

    @Column({ type: 'bool' })
    isStarred: boolean;

    @Column({ type: 'bool' })
    isInLibrary: boolean;

    @Column({ type: 'bool', default: false })
    wasInLibrary: boolean;

    @Column({ type: 'int4' })
    currentPage: number;

    @Column({ type: 'bool' })
    isPaid: boolean;

    @Column()
    isViewed: boolean;
}

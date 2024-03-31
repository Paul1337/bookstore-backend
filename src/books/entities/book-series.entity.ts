import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class BookSeries {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @Column({ type: 'varchar', length: 64 })
    name: string;

    @ManyToOne(() => User, user => user.writtenBooks)
    author: User;

    @Column('int4')
    authorId: number;

    @OneToMany(() => Book, book => book.series)
    books: Book[];
}

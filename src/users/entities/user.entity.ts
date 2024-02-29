import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { Book } from 'src/books/entities/book.entity';
import { UserBooks } from 'src/books/entities/user-books.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @Column({ type: 'varchar', length: 64, default: '' })
    firstName: string;

    @Column({ type: 'varchar', length: 64, default: '' })
    lastName: string;

    @Column({ type: 'varchar', length: 64 })
    email: string;

    @Column({ type: 'varchar', length: 64 })
    username: string;

    @Column({ type: 'varchar', length: 1024 })
    password: string;

    @JoinTable({ name: 'user_roles' })
    @ManyToMany(() => UserRole)
    roles: UserRole[];

    @OneToMany(type => Book, book => book.author)
    writtenBooks: Book[];
}

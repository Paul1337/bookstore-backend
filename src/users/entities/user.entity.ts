import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
    OneToOne,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { Book } from 'src/books/entities/book.entity';
import { UserBooks } from 'src/books/entities/user-books.entity';
import { UserProfile } from './user-profile.entity';

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
    // {
    //     eager: true,
    // })
    roles: UserRole[];

    @Column({ type: 'bool' })
    isBanned: boolean;

    @OneToMany(type => Book, book => book.author)
    writtenBooks?: Book[];

    @OneToOne(type => UserProfile, {
        cascade: ['update', 'insert'],
    })
    @JoinColumn()
    profile: UserProfile;
}

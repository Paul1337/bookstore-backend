import { Book } from 'src/books/entities/book.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { UserRole } from './user-role.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @Column({ type: 'varchar', nullable: true })
    google_id: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'varchar', length: 64, default: '' })
    firstName: string;

    @Column({ type: 'varchar', length: 64, default: '' })
    lastName: string;

    @Column({ type: 'varchar', length: 64 })
    email: string;

    @Column({ type: 'varchar', length: 64 })
    username: string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    password: string;

    @JoinTable({ name: 'user_roles' })
    @ManyToMany(() => UserRole, {
        eager: true,
        cascade: ['insert', 'update', 'remove'],
    })
    roles: UserRole[];

    @Column({ type: 'bool', default: false })
    isBanned: boolean;

    @OneToMany(type => Book, book => book.author)
    writtenBooks?: Book[];

    @OneToOne(type => UserProfile, {
        cascade: ['update', 'insert', 'remove'],
    })
    @JoinColumn()
    profile: UserProfile;
}

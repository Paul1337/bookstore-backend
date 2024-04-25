import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BookStatus } from '../enums/book-status.enum';
import { BookGenre } from './book-genre.entity';
import { BookPart } from './book-part.entity';
import { BookSeries } from './book-series.entity';
import { BookStat } from './book-stat.entity';

@Entity()
export class Book {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @Column({ type: 'varchar', length: 128, default: '' })
    title: string;

    @Column({ type: 'varchar', length: 1024, default: '' })
    description: string;

    @Column({ type: 'int4', default: 0 })
    rewardsCount: number;

    @ManyToOne(() => User, user => user.writtenBooks, {
        nullable: false,
    })
    author?: User;

    @Column({ type: 'int4' })
    authorId: number;

    @ManyToMany(type => BookGenre, {
        // eager: true,
        cascade: ['insert', 'update'],
    })
    @JoinTable({ name: 'book_genres' })
    genres: BookGenre[];

    @CreateDateColumn({ type: 'timestamp', nullable: true })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    publishedAt: Date;

    // @Column({ type: 'int4', default: 0 })
    // addsToLibraryCount: number;

    @Column({ type: 'varchar', length: 2048, nullable: true })
    backgroundSrc?: string;

    @Column({ type: 'varchar', length: 2048, nullable: true })
    coverSrc?: string;

    @Column({ type: 'int4', default: 0 })
    cost: number;

    @Column({ type: 'int4', nullable: true })
    freeChaptersCount: number;

    @Column({ type: 'varchar', length: 64, default: BookStatus.Unfinished })
    status: BookStatus;

    @Column({ type: 'bool', default: false })
    isPublished: boolean;

    @Column({ type: 'bool', default: false })
    isBanned: boolean;

    @Column({ type: 'varchar', length: 32, nullable: true })
    ageRestriction: string;

    @ManyToOne(() => BookSeries, series => series.id, {
        nullable: true,
    })
    series?: BookSeries;

    @OneToMany(() => BookPart, part => part.book, {
        cascade: ['remove'],
    })
    parts: BookPart[];

    @Column({ type: 'int4', nullable: true })
    seriesId: number;

    @OneToMany(type => BookPart, part => part.book, { cascade: ['remove'] })
    bookParts: BookPart[];

    @OneToOne(type => BookStat, {
        cascade: ['update', 'insert', 'remove'],
        nullable: true,
    })
    @JoinColumn()
    bookStat?: BookStat;
}

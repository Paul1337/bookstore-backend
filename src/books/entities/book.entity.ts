import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BookStatus } from '../enums/book-status.enum';
import { BookSeries } from './book-series.entity';

@Entity()
export class Book {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @Column({ type: 'varchar', length: 64 })
    title: string;

    @Column({ type: 'varchar', length: 64 })
    description: string;

    @Column({ type: 'int4' })
    starsCount: number;

    @Column({ type: 'int4' })
    viewsCount: number;

    @Column({ type: 'int4' })
    rewardsCount: number;

    @ManyToOne(() => User, (user) => user.books)
    author: User;

    @Column({ type: 'timestamp' })
    createdAt: Date;

    @Column({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: 'int4' })
    addsToLibraryCount: number;

    @Column({ type: 'varchar', length: 64 })
    backgroundSrc: string;

    @Column({ type: 'varchar', length: 64 })
    coverSrc: string;

    @Column({ type: 'int4' })
    cost: number;

    @Column({ type: 'int4' })
    freeChaptersCount: number;

    @Column({ type: 'varchar', length: 64 })
    status: BookStatus;

    @Column({ type: 'bool' })
    isPublished: boolean;

    @Column({ type: 'bool' })
    isBanned: boolean;

    @Column({ type: 'varchar', length: 32 })
    ageRestriction: string;

    @ManyToOne(() => BookSeries, (series) => series.id)
    series: BookSeries;

    @ManyToMany(() => User, (user) => user.starredBooks)
    starredUsers: User[];

    // @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    // createdAt: Date;

    // @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    // updatedAt: Date;
}

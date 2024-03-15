import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BookStatus } from '../enums/book-status.enum';
import { BookSeries } from './book-series.entity';
import { BookPart } from './book-part.entity';

@Entity()
export class Book {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @Column({ type: 'varchar', length: 128 })
    title: string;

    @Column({ type: 'varchar', length: 1024 })
    description: string;

    // @Column({ type: 'int4' })
    // viewsCount: number;

    @Column({ type: 'int4' })
    rewardsCount: number;

    @ManyToOne(() => User, user => user.writtenBooks, {
        nullable: false,
    })
    author?: User;

    @Column({ type: 'int4' })
    authorId: number;

    @Column({ type: 'timestamp', nullable: true })
    createdAt: Date;

    // @Column({ type: 'timestamp', nullable: true })
    // finishedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @Column({ type: 'int4' })
    addsToLibraryCount: number;

    @Column({ type: 'varchar', length: 2048, nullable: true })
    backgroundSrc: string;

    @Column({ type: 'varchar', length: 2048, nullable: true })
    coverSrc: string;

    @Column({ type: 'int4', nullable: true })
    cost: number;

    @Column({ type: 'int4', nullable: true })
    freeChaptersCount: number;

    @Column({ type: 'varchar', length: 64 })
    status: BookStatus;

    @Column({ type: 'bool' })
    isPublished: boolean;

    @Column({ type: 'bool' })
    isBanned: boolean;

    @Column({ type: 'varchar', length: 32 })
    ageRestriction: string;

    @ManyToOne(() => BookSeries, series => series.id, {
        nullable: true,
    })
    series?: BookSeries;

    @OneToMany(() => BookPart, part => part.book)
    parts: BookPart[];

    @Column({ type: 'int4', nullable: true })
    seriesId: number;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BookStat {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @Column({ type: 'int4', default: 0 })
    starsCount: number = 0;

    @Column({ type: 'int4', default: 0 })
    addsToLibraryCount: number = 0;

    @Column({ type: 'int4', default: 0 })
    viewsCount: number = 0;

    @Column({ type: 'int4', default: 0 })
    readCount: number = 0;

    @Column({ type: 'double precision', default: 0 })
    readTime: number = 0;

    @Column({ type: 'int4', default: 0 })
    paidCount: number = 0;

    @Column('int4', { default: 0 })
    pagesCount: number;
}

import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Book {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @Column({ type: 'varchar', length: 64 })
    name: string;

    @Column({ type: 'varchar', length: 64 })
    description: string;

    @Column({ type: 'int4' })
    likesCount: number;

    @Column({ type: 'int4' })
    viewsCount: number;

    @Column({ type: 'int4' })
    rewardsCount: number;

    @ManyToOne(() => User, (user) => user.books)
    author: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    updatedAt: Date;
}

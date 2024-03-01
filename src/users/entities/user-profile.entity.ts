import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int4' })
    age: number;

    @Column({ type: 'int4' })
    balance: number;

    @Column({ type: 'varchar', length: 128 })
    userImg: string;

    @Column({ type: 'varchar', length: 128 })
    backgroundImg: string;
}

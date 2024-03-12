import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int4', nullable: true })
    age: number;

    @Column({ type: 'int4', default: 0 })
    balance: number;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    userImg: string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    backgroundImg: string;
}

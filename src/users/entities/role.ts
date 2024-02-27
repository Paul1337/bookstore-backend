import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserRole {
    @PrimaryGeneratedColumn({ type: 'int4' })
    id: number;

    @Column({ type: 'varchar', length: 64, default: '' })
    name: string;

    @ManyToMany(() => User, user => user.roles)
    users: User[];
}

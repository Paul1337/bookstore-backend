import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: '',
    })
    firstName: string;

    @Column({
        default: '',
    })
    lastName: string;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @JoinTable({
        name: 'user_roles',
    })
    @ManyToMany(() => UserRole)
    roles: UserRole[];
}

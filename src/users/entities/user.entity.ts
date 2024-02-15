import { Role } from 'src/auth/enums/role.enum';
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
import { UserRoles } from './user-roles.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @JoinTable()
    @ManyToMany(() => UserRole)
    roles: Role[];
}

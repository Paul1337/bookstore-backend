import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserRoles {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    roleId: number;
}

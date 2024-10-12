import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'varchar', length: 64, default: '' })
  firstName: string;

  @Column({ type: 'varchar', length: 64, default: '' })
  lastName: string;

  @Column({ type: 'int4', default: 0 })
  balance: number;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  userImg: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  backgroundImg: string;
}

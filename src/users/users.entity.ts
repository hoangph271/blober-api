import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  fullName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ unique: true })
  username: string;

  @Column({ length: 60 })
  password: string;
}

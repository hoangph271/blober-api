import { Exclude } from 'class-transformer';
import { nanoid } from 'nanoid';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ type: 'string', length: 21 })
  _id: string;
  @BeforeInsert()
  setId() { this._id = nanoid() }

  @Column()
  fullName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column({ length: 60 })
  password: string;
}

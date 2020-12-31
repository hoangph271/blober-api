import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Album } from './albums.entity';

@Entity()
export class AlbumPic {
  @PrimaryColumn({ type: 'string', length: 21 })
  _id: string;
  @BeforeInsert()
  setId() { this._id = nanoid() }

  @Column()
  title: string;

  @Column()
  blobId: string;

  @ManyToOne(() => Album)
  @JoinColumn()
  album: Album;
}

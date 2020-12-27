import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Album } from './albums.entity';

@Entity()
export class AlbumPic {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column()
  blobUuid: string;

  @ManyToOne(() => Album)
  @JoinColumn()
  album: Album;
}

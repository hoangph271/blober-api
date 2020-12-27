import { IsPositive } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlbumPic } from './albums.pic.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column()
  @IsPositive()
  picsCount: number;

  @OneToMany(() => AlbumPic, (albumPic) => albumPic.album, { eager: true })
  @JoinTable()
  pics: AlbumPic[];
}

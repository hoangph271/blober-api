import { Exclude, Expose } from 'class-transformer';
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

  @Exclude()
  @OneToMany(() => AlbumPic, (albumPic) => albumPic.album, { eager: true })
  @JoinTable()
  pics: AlbumPic[];

  @Expose({ name: 'pics' })
  get albumPics() {
    return this.pics.map(pic => {
      const { uuid, title, blobUuid } = pic

      return {
        uuid,
        title,
        url: `blobs/raw/${blobUuid}`
      }
    })
  }
}

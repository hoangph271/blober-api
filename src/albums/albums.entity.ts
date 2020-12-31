import { Exclude, Expose } from 'class-transformer';
import { IsPositive } from 'class-validator';
import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { AlbumPic } from './albums.pic.entity';

@Entity()
export class Album {
  @PrimaryColumn({ type: 'varchar', length: 21 })
  _id: string;
  @BeforeInsert()
  setId() {
    this._id = nanoid();
  }

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
    return this.pics.map((pic) => {
      const { _id, title, blobId } = pic;

      return {
        _id,
        title,
        url: `blobs/raw/${blobId}`,
      };
    });
  }
}

import { Album } from '../albums/albums.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Pic {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @IsNotEmpty()
  @Column()
  filePath: string;

  @Column()
  fileSize: number;

  @ManyToOne(() => Album, album => album.pics)
  album: Album;
}

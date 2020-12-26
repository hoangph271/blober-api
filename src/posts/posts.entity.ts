import { IsPositive } from 'class-validator';
import { Pic } from 'src/pics/pics.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column()
  dirName: string;

  @Column()
  @IsPositive()
  picsCount: number;

  @OneToMany(() => Pic, (pic) => pic.post)
  pics: Pic[];

  static relations = {
    pics: 'pics',
  };
}

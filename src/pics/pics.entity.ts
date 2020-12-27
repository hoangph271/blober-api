import { Post } from '../posts/posts.entity';
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

  @ManyToOne(() => Post, (post) => post.pics)
  post: Post;
}

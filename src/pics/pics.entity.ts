import { Post } from '../posts/posts.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pic {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  fileName: string;

  @Column()
  fileSize: number;

  @ManyToOne(() => Post, (post) => post.pics)
  post: Post;
}

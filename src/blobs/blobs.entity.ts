import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Blob {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @IsNotEmpty()
  @Column()
  blobPath: string;

  @Column()
  fileName: string

  @Column()
  contentType: string;

  @Column()
  fileSize: number;

  @Column({ default: '{}' })
  metadata: string;
}

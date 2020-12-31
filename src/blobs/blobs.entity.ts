import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class Blob {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Exclude()
  @IsNotEmpty()
  @Column()
  blobPath: string;

  @Column()
  fileName: string;

  @Column()
  contentType: string;

  @Column()
  fileSize: number;

  @Exclude()
  @Column({ default: '{}' })
  metadata: string;

  @Expose({ name: 'metadata' })
  get metadataDeserialized() {
    return JSON.parse(this.metadata);
  }
}

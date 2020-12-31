import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { nanoid } from 'nanoid';

@Entity()
export class Blob {
  @PrimaryColumn({ type: 'string', length: 21 })
  _id: string;
  @BeforeInsert()
  setId() { this._id = nanoid() }

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

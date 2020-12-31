import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { nanoid } from 'nanoid';

@Entity()
export class Blob {
  @BeforeInsert()
  setId() {
    this._id = nanoid();
  }

  @PrimaryColumn({ type: 'varchar', length: 21 })
  _id: string;

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

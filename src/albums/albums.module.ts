import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlobsModule } from '../blobs/blobs.module';
import { Blob } from '../blobs/blobs.entity';
import { BlobsService } from '../blobs/blobs.service';
import { AlbumsController } from './albums.controller';
import { Album } from './albums.entity';
import { AlbumsService } from './albums.service';
import { AlbumPic } from './albums.pic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Blob, AlbumPic]), BlobsModule],
  providers: [AlbumsService, BlobsService],
  exports: [AlbumsService],
  controllers: [AlbumsController],
})
export class AlbumsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsController } from './albums.controller';
import { Album } from './albums.entity';
import { AlbumsService } from './albums.service';
import { AlbumPic } from './albums.pic.entity';
import { AlbumPicsService } from './albums.pic.service';

@Module({
  imports: [TypeOrmModule.forFeature([Album, AlbumPic])],
  providers: [AlbumsService, AlbumPicsService],
  exports: [AlbumsService, AlbumPicsService],
  controllers: [AlbumsController],
})
export class AlbumsModule {}

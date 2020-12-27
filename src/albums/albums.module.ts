import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PicsModule } from '../pics/pics.module';
import { Pic } from '../pics/pics.entity';
import { PicsService } from '../pics/pics.service';
import { AlbumsController } from './albums.controller';
import { Album } from './albums.entity';
import { AlbumsService } from './albums.service';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Pic]), PicsModule],
  providers: [AlbumsService, PicsService],
  exports: [AlbumsService],
  controllers: [AlbumsController],
})
export class AlbumsModule {}

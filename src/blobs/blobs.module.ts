import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blob } from './blobs.entity';
import { BlobsController } from './blobs.controller';
import { BlobsService } from './blobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Blob])],
  providers: [BlobsService],
  exports: [BlobsService],
  controllers: [BlobsController],
})
export class BlobsModule {}

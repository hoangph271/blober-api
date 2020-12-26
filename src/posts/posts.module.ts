import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PicsModule } from '../pics/pics.module';
import { Pic } from '../pics/pics.entity';
import { PicsService } from '../pics/pics.service';
import { PostsController } from './posts.controller';
import { Post } from './posts.entity';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Pic]), PicsModule],
  providers: [PostsService, PicsService],
  exports: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}

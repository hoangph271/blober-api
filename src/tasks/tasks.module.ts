import { Module } from '@nestjs/common';
import { BlobsModule } from '../blobs/blobs.module';
import { AlbumsModule } from '../albums/albums.module';
import { SeederService } from './seeder.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AlbumsModule, BlobsModule, UsersModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class TasksModule {}

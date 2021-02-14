import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { AlbumsModule } from './albums/albums.module'
import { BlobsModule } from './blobs/blobs.module'
import { TasksModule } from './tasks/tasks.module'
import { FilesModule } from './files/files.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UsersModule,
    AuthModule,
    AlbumsModule,
    BlobsModule,
    TasksModule,
    FilesModule,
  ],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Album } from './albums/albums.entity';
import { Blob } from './blobs/blobs.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AlbumsModule } from './albums/albums.module';
import { BlobsModule } from './blobs/blobs.module';
import { AlbumPic } from './albums/albums.pic.entity';
import { DATABASE } from './utils/env';

const dbConfigs: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: DATABASE,
  synchronize: true,
  entities: [User, Album, Blob, AlbumPic],
};
@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfigs),
    UsersModule,
    AuthModule,
    AlbumsModule,
    BlobsModule,
  ],
  providers: [],
})
export class AppModule {}

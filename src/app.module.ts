import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Album } from './albums/albums.entity';
import { Pic } from './pics/pics.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AlbumsModule } from './albums/albums.module';
import { PicsModule } from './pics/pics.module';

const dbConfigs: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: [User, Album, Pic],
};
@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfigs),
    UsersModule,
    AuthModule,
    AlbumsModule,
    PicsModule,
  ],
  providers: [],
})
export class AppModule {}

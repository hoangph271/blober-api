import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Post } from './posts/posts.entity';
import { Pic } from './pics/pics.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { PicsModule } from './pics/pics.module';

const dbConfigs: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: [User, Post, Pic],
};
@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfigs),
    UsersModule,
    AuthModule,
    PostsModule,
    PicsModule,
  ],
  providers: [],
})
export class AppModule {}

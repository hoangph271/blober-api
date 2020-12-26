import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

const dbConfigs: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: [User],
};
@Module({
  imports: [TypeOrmModule.forRoot(dbConfigs), UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

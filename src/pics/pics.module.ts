import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pic } from './pics.entity';
import { PicsController } from './pics.controller';
import { PicsService } from './pics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pic])],
  providers: [PicsService],
  exports: [PicsService],
  controllers: [PicsController],
})
export class PicsModule {}

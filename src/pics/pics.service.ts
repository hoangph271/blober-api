import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbService } from '../db.service';
import { Repository } from 'typeorm';
import { Pic } from './pics.entity';

@Injectable()
export class PicsService extends DbService<Pic> {
  constructor(
    @InjectRepository(Pic)
    picRepository: Repository<Pic>,
  ) {
    super(picRepository);
  }
}

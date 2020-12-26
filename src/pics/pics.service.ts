import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbService } from '../db.service';
import { Repository } from 'typeorm';
import { Pic } from './pics.entity';
import { Env } from '../utils/env';

@Injectable()
export class PicsService extends DbService<Pic> implements OnModuleInit {
  constructor(
    @InjectRepository(Pic)
    picRepository: Repository<Pic>,
  ) {
    super(picRepository);
  }

  async onModuleInit() {
    if (Env.isNOTDev()) return;

    await this.DANGEROUS_deleteAll();
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
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
    if (Env.needsResetDb()) await this.DANGEROUS_deleteAll();
  }

  async createReadStream(pic: Pic): Promise<fs.ReadStream | null> {
    return fs.promises
      .access(pic.filePath, fs.constants.R_OK)
      .then(() => fs.createReadStream(pic.filePath))
      .catch((error) => {
        console.info(error);
        return null;
      });
  }
}

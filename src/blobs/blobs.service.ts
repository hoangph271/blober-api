import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { DbService } from '../db.service';
import { Repository } from 'typeorm';
import { Blob } from './blobs.entity';
import { NEEDS_RESET_DB } from '../utils/env';

@Injectable()
export class BlobsService extends DbService<Blob> implements OnModuleInit {
  constructor(
    @InjectRepository(Blob)
    picRepository: Repository<Blob>,
  ) {
    super(picRepository);
  }

  async onModuleInit() {
    if (NEEDS_RESET_DB) await this.DANGEROUS_deleteAll();
  }

  async createReadStream(blob: Blob): Promise<fs.ReadStream | null> {
    return fs.promises
      .access(blob.blobPath, fs.constants.R_OK)
      .then(() => fs.createReadStream(blob.blobPath))
      .catch((error) => {
        console.info(error);
        return null;
      });
  }
}

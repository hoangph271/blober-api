import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as fs from 'fs'
import { DbService } from '../db.service'
import { Repository } from 'typeorm'
import { Blob } from './blobs.entity'

@Injectable()
export class BlobsService extends DbService<Blob> {
  constructor(
    @InjectRepository(Blob)
    picRepository: Repository<Blob>,
  ) {
    super(picRepository)
  }
  async createReadStream(blob: Blob): Promise<fs.ReadStream | null> {
    return fs.promises
      .access(blob.blobPath, fs.constants.R_OK)
      .then(() => fs.createReadStream(blob.blobPath))
      .catch((error) => {
        console.info(error)
        return null
      })
  }
}

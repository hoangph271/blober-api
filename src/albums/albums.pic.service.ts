import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DbService } from '../db.service'
import { AlbumPic } from './albums.pic.entity'

@Injectable()
export class AlbumPicsService extends DbService<AlbumPic> {
  constructor(
    @InjectRepository(AlbumPic)
    albumRepository: Repository<AlbumPic>,
  ) {
    super(albumRepository)
  }
}

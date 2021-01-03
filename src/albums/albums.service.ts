import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DbService } from '../db.service'
import { Repository } from 'typeorm'
import { Album } from './albums.entity'

@Injectable()
export class AlbumsService extends DbService<Album> {
  constructor(
    @InjectRepository(Album)
    albumRepository: Repository<Album>,
  ) {
    super(albumRepository)
  }
}

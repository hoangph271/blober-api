import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { DEFAULT_TAKE_COUNT } from '../utils/env'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AlbumsService } from './albums.service'

@Controller('albums')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAlbums(
    @Query('skip') skip = '0',
    @Query('take') take = DEFAULT_TAKE_COUNT,
  ) {
    const albums = await this.albumsService.findManyBy({
      skip: Number(skip),
      take: Number(take),
    })
    const itemCount = await this.albumsService.countBy({})

    return {
      itemCount,
      items: albums,
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findAlbum(@Param('id') id: string) {
    const album = await this.albumsService.findOne(id)

    return album
  }
}

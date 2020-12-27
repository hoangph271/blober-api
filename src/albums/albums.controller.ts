import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Env } from '../utils/env';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Album } from './albums.entity';
import { AlbumsService } from './albums.service';

@Controller('albums')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAlbums(
    @Query('skip') skip = '0',
    @Query('take') take = Env.DEFAULT_TAKE_COUNT,
  ) {
    const albums = await this.albumsService.findManyBy({
      skip: Number(skip),
      take: Number(take),
    });

    return {
      count: albums.length,
      nextSkip: Number(skip) + albums.length,
      albums,
    };
  }
}

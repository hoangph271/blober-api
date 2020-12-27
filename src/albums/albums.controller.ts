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
    @Query('skip') skip = 0,
    @Query('take') take: number = Env.DEFAULT_TAKE_COUNT,
    @Query('withPics') withPics = false,
  ) {
    // TODO: https://github.com/nestjs/nest/issues/4713
    // * Validate skip & limit
    // * For now, the server dies when skip or limit is NOT a number
    const albums = await this.albumsService.findManyBy({
      skip,
      take,
      relations: withPics ? [Album.relations.pics] : [],
    });

    return {
      count: albums.length,
      // TODO: Remove this Number() after above steps
      nextSkip: Number(skip) + albums.length,
      albums,
    };
  }
}

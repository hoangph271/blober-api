import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DEFAULT_TAKE_COUNT } from '../utils/env';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AlbumsService } from './albums.service';

@Controller('albums')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAlbums(
    @Query('skip') skip = '0',
    @Query('take') take = DEFAULT_TAKE_COUNT,
  ) {
    return await this.albumsService.findManyBy({
      skip: Number(skip),
      take: Number(take),
    });
  }
}

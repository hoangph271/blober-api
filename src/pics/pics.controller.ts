import * as path from 'path';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import * as sharp from 'sharp';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PicsService } from './pics.service';
import { ReadStream } from 'typeorm/platform/PlatformTools';

@Controller('pics')
export class PicsController {
  constructor(private picsService: PicsService) {}
  @Get(':uuid')
  @UseGuards(JwtAuthGuard)
  async findPic(@Param('uuid') uuid: string) {
    const pic = await this.picsService.findOne(uuid);

    if (!pic) throw new NotFoundException();

    return pic;
  }

  @Get('raw/:uuid')
  @UseGuards(JwtAuthGuard)
  async readRawPic(
    @Param('uuid') uuid: string,
    @Query('size') size: string,
    @Res() res: Response,
  ) {
    const pic = await this.picsService.findOne(uuid);

    if (!pic) throw new NotFoundException();

    const picStream = await this.picsService.createPicsReadStream(pic);

    if (!picStream) throw new NotFoundException();

    if (!size) {
      const imageType = path.extname(pic.filePath).slice(1);
      res.setHeader('Content-Type', `image/${imageType}`);
      picStream.pipe(res);
      return;
    }

    const [width, height] = size.split('x').map(Number);
    const ws = await this.createResizedPic(picStream, { width, height });
    res.setHeader('Content-Type', `image/webp`);
    ws.pipe(res);
  }

  private async createResizedPic(
    picStream: ReadStream,
    { width, height }: ImageSize,
  ) {
    const resizer = sharp()
      .resize({
        fit: sharp.fit.cover,
        width,
        height,
      })
      .webp();

    return picStream.pipe(resizer);
  }
}

type ImageSize = {
  width: number;
  height: number;
};

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
import { BlobsService } from './blobs.service';
import { ReadStream } from 'typeorm/platform/PlatformTools';

@Controller('blobs')
export class BlobsController {
  constructor(private blobsService: BlobsService) {}
  @Get(':uuid')
  @UseGuards(JwtAuthGuard)
  async findBlob(@Param('uuid') uuid: string) {
    const blob = await this.blobsService.findOne(uuid);

    if (!blob) throw new NotFoundException();

    return {
      ...blob,
      metadata: JSON.parse(blob.metadata)
    };
  }

  @Get('raw/:uuid')
  @UseGuards(JwtAuthGuard)
  async readBlob(
    @Param('uuid') uuid: string,
    @Query('size') size: string,
    @Res() res: Response,
  ) {
    const blob = await this.blobsService.findOne(uuid);

    if (!blob) throw new NotFoundException();

    const blobStream = await this.blobsService.createReadStream(blob);

    if (!blobStream) throw new NotFoundException();
    res.setHeader('Content-Disposition', `attachment; filename="${blob.fileName}"`);

    switch (true) {
      case blob.contentType.startsWith('image'): {
        size = size || JSON.parse(blob.metadata).size;

        const [width, height] = size ? size.split('x').map(Number) : [];

        const ws = await createResizedPic(blobStream, { width, height });
        res.setHeader('Content-Type', 'image/webp');
        ws.pipe(res);

        break;
      }
      default: {
        res.setHeader('Content-Type', 'application/octet-stream');
        blobStream.pipe(res);
      }
    }
  }
}

async function createResizedPic(
  blobStream: ReadStream,
  { width, height }: ImageSize,
) {
  const resizer = sharp()
    .resize({
      fit: sharp.fit.cover,
      width,
      height,
    })
    .webp();

  return blobStream.pipe(resizer);
}

type ImageSize = {
  width: number;
  height: number;
};
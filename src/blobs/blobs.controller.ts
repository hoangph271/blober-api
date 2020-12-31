import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { resizeImageStream } from '../utils/image';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BlobsService } from './blobs.service';

@Controller('blobs')
export class BlobsController {
  constructor(private blobsService: BlobsService) {}
  @Get(':uuid')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async findBlob(@Param('uuid') uuid: string) {
    const blob = await this.blobsService.findOne(uuid);

    if (!blob) throw new NotFoundException();

    return blob;
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
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${blob.fileName}"`,
    );

    switch (true) {
      case blob.contentType.startsWith('image'): {
        size = size || JSON.parse(blob.metadata).size;

        const [width, height] = size
          ? size.split('x').map((val) => (val ? Number(val) : undefined))
          : [];

        const ws = await resizeImageStream(blobStream, { width, height });
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

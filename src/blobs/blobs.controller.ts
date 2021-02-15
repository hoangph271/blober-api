import {
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Query,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Response } from 'express'
import { resizeImageStream } from '../utils/image'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { BlobsService } from './blobs.service'

@Controller('blobs')
export class BlobsController {
  constructor(private blobsService: BlobsService) {}
  @Get(':_id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async findBlob(@Param('_id') _id: string, @Request() req) {
    const blob = await this.blobsService.findOne(_id)

    if (!blob) throw new NotFoundException()

    if (blob.ownerId && blob.ownerId !== req.user._id) {
      throw new ForbiddenException()
    }

    return blob
  }

  @Get('raw/:_id')
  @UseGuards(JwtAuthGuard)
  async readBlob(
    @Param('_id') _id: string,
    @Query('size') size: string,
    @Res() res: Response,
    @Request() req,
  ) {
    const blob = await this.blobsService.findOne(_id)

    if (!blob) throw new NotFoundException()

    if (blob.ownerId && blob.ownerId !== req.user._id) {
      throw new ForbiddenException()
    }

    const blobStream = await this.blobsService.createReadStream(blob)

    if (!blobStream) throw new NotFoundException()

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${blob.fileName}"`,
    )

    switch (true) {
      case blob.contentType.startsWith('image'): {
        size = size || JSON.parse(blob.metadata).size

        const [width, height] = size
          ? size.split('x').map((val) => (val ? Number(val) : undefined))
          : []

        const rs = await resizeImageStream(blobStream, { width, height })
        res.setHeader('Content-Type', 'image/webp')
        rs.pipe(res)

        break
      }
      default: {
        res.setHeader('Content-Type', 'application/octet-stream')
        blobStream.pipe(res)
      }
    }
  }
}

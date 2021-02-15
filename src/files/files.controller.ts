import { Headers, HttpStatus, Query, UseGuards } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'
import { Res } from '@nestjs/common'
import { Controller, Get } from '@nestjs/common'
import { Response } from 'express'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { FilesService, FSItem } from './files.service'

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getItem(@Query('path') itemPath?: string): Promise<FSItem[] | FSItem> {
    if (!itemPath) {
      return this.filesService.readRoot()
    }

    return this.filesService.readPath(itemPath)
  }

  @Get('raw')
  @UseGuards(JwtAuthGuard)
  async getItemBinary(
    @Query('path') itemPath: string,
    @Headers() headers,
    @Res() res: Response,
  ) {
    if (!itemPath) {
      throw new NotFoundException()
    }

    const mime = await this.filesService.getContentType(itemPath)
    res.setHeader('Content-Type', mime)

    const { range = '' } = headers

    if (!range) {
      const rs = this.filesService.getFileReadable(itemPath)
      rs.pipe(res)
      return
    }

    const { size } = await this.filesService.getStats(itemPath)
    const parts = range.replace(/bytes=/, '').split('-')
    const start = Number.parseInt(parts[0], 10)
    const end = parts[1] ? Number.parseInt(parts[1], 10) : size - 1
    const chunksize = end - start + 1

    res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Content-Length', chunksize)
    res.status(HttpStatus.PARTIAL_CONTENT)

    const rs = this.filesService.getFileReadable(itemPath, { start, end })
    rs.pipe(res)
  }

  @Get('preview')
  @UseGuards(JwtAuthGuard)
  async getItemPreview(@Query('path') itemPath: string, @Res() res: Response) {
    if (!itemPath) {
      throw new NotFoundException()
    }

    const { rs, mime } = await this.filesService.previewStream(itemPath)
    res.setHeader('Content-Type', mime)
    rs.pipe(res)
  }
}

import * as path from 'path'
import {
  Headers,
  HttpStatus,
  InternalServerErrorException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'
import { Res } from '@nestjs/common'
import { Controller, Get } from '@nestjs/common'
import { Response } from 'express'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { FilesService, FSItem } from './files.service'

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get(':_id?')
  @UseGuards(JwtAuthGuard)
  async getItem(@Param('_id') _id = ''): Promise<FSItem> {
    const fsItem = await this.filesService.readPath(_id)

    if (!fsItem) {
      throw new NotFoundException()
    }

    return fsItem
  }

  @Get('raw/:_id?')
  @UseGuards(JwtAuthGuard)
  async getItemBinary(
    @Headers() headers,
    @Res() res: Response,
    @Param('_id') _id = '',
  ) {
    const fullPath = await this.filesService.findPath(_id)

    if (!fullPath) {
      throw new NotFoundException()
    }

    const mime = await this.filesService.getContentType(fullPath)
    res.setHeader('Content-Type', mime)
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(path.basename(fullPath))}"`,
    )

    const { range = '' } = headers

    if (!range) {
      const rs = this.filesService.getFileReadable(fullPath)
      rs.pipe(res)
      return
    }

    const { size } = await this.filesService.getStats(fullPath)
    const parts = range.replace(/bytes=/, '').split('-')
    const start = Number.parseInt(parts[0], 10)
    const end = parts[1] ? Number.parseInt(parts[1], 10) : size - 1
    const chunksize = end - start + 1

    res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Content-Length', chunksize)
    res.status(HttpStatus.PARTIAL_CONTENT)

    const rs = this.filesService.getFileReadable(fullPath, { start, end })
    rs.pipe(res)
  }

  @Get('preview/:_id?')
  @UseGuards(JwtAuthGuard)
  async getItemPreview(@Res() res: Response, @Param('_id') _id = '') {
    const fullPath = await this.filesService.findPath(_id)

    if (!fullPath) {
      throw new NotFoundException()
    }

    const { rs, mime } = await this.filesService
      .previewStream(fullPath)
      .catch(() => {
        throw new InternalServerErrorException()
      })

    if (!rs) throw new NotFoundException()

    res.setHeader('Content-Type', mime)
    rs.pipe(res)
  }
}

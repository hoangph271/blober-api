import { Query, UseGuards } from '@nestjs/common'
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

import { Query, UseGuards } from '@nestjs/common'
import { Controller, Get } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
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
}

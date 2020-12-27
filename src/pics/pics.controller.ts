import * as path from 'path'
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PicsService } from './pics.service';

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
  async readRawPic(@Param('uuid') uuid: string, @Res() res: Response) {
    // TODO: Stream file down to client
    const pic = await this.picsService.findOne(uuid);

    if (!pic) throw new NotFoundException();

    const rs = await this.picsService.createReadStream(pic);

    if (!rs) throw new NotFoundException();

    const imageType = path.extname(pic.filePath).slice(1)
    res.setHeader('Content-Type', `image/${imageType}`)
    rs.pipe(res);
  }
}

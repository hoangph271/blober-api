import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { LocalAuthGuard } from './local-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Req() req) {
    const token = await this.authService.login(req)
    return {
      token,
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req) {
    return req.user
  }
}

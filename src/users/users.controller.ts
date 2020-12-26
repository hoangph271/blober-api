import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HASH_ROUNDS } from 'src/constants';
import { CreateUserDto } from './dto/create.user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOne(@Request() req) {
    const { uuid } = req.user;

    const user = await this.usersService.findOneBy({ uuid });

    if (!user) throw new NotFoundException();

    return UserDto.buildPurified(user);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const existedUser = await this.usersService.findOneBy({ username });

    if (existedUser)
      throw new HttpException('username already in used', HttpStatus.CONFLICT);

    const { generatedMaps, raw: insertCount } = await this.usersService.create({
      ...createUserDto,
      password: await bcrypt.hash(password, HASH_ROUNDS),
    });

    if (!insertCount)
      return new HttpException('username already in used', HttpStatus.CONFLICT);

    const { uuid, isActive } = generatedMaps[0];

    return UserDto.buildPurified({
      uuid,
      isActive,
      ...createUserDto,
    });
  }
}

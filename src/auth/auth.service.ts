import { Injectable, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

export class AuthPayload {
  _id: string;
  roles: string[];
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthPayload | null> {
    const dbUser = await this.usersService.findOneBy({ username });

    if (!dbUser || !dbUser.isActive) return null;

    const isSuccess = await bcrypt.compare(password, dbUser.password);

    if (!isSuccess) return null;

    return {
      _id: dbUser._id,
      roles: [], // TODO: Read from DB
    };
  }

  async login(@Request() req) {
    const { _id, roles } = req.user;
    const payload: AuthPayload = {
      _id,
      roles,
    };

    return this.jwtService.sign(payload);
  }
}

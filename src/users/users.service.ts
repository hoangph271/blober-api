import { OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbService } from '../db.service';
import { Env } from '../utils/env';
import { Repository } from 'typeorm';
import { User } from './users.entity';
export class UsersService extends DbService<User> implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async onModuleInit() {
    if (Env.isNOTDev()) return;

    const bcrypt = await import('bcryptjs');

    await this.DANGEROUS_deleteAll();

    await this.create({
      fullName: '@HHP',
      isActive: true,
      username: 'username',
      password: await bcrypt.hash('password', Env.HASH_ROUNDS),
    });
  }
}

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
    if (Env.NEEDS_RESET_DB) {
      const bcrypt = await import('bcryptjs');

      await this.DANGEROUS_deleteAll();

      const username = 'username';
      const user = await this.findOneBy({ username });
      if (user) return;

      await this.create({
        username,
        fullName: 'fullName',
        isActive: true,
        password: await bcrypt.hash('password', Env.HASH_ROUNDS),
      });
    }
  }
}

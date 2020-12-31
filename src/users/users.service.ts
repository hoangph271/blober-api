import { InjectRepository } from '@nestjs/typeorm';
import { DbService } from '../db.service';
import { Repository } from 'typeorm';
import { User } from './users.entity';
export class UsersService extends DbService<User> {
  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}

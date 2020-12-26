import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './users.entity';

export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: string) {
    return this.userRepository.findOne(id);
  }

  async findOneBy(query: FindConditions<User>) {
    return this.userRepository.findOne(query);
  }

  async create(user: CreateUserDto) {
    return this.userRepository.insert(user);
  }
}

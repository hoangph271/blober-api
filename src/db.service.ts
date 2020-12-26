import { FindConditions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

type PartialEntity<T> = QueryDeepPartialEntity<T>;
export abstract class DbService<Entity> {
  constructor(private entityRepository: Repository<Entity>) {}

  async findOne(id: string) {
    return this.entityRepository.findOne(id);
  }

  async findOneBy(where: FindConditions<Entity>) {
    return this.entityRepository.findOne(where);
  }

  async findManyBy(where: FindConditions<Entity>, skip = 0, take: number) {
    return this.entityRepository.find({
      skip,
      take,
      where,
    });
  }

  async create(entity: PartialEntity<Entity>) {
    return this.entityRepository.insert(entity);
  }

  async DANGEROUS_deleteAll() {
    return this.entityRepository.delete({});
  }
}

import { nanoid } from 'nanoid'
import { FindConditions, FindManyOptions, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

type PartialEntity<T> = QueryDeepPartialEntity<T>
type PartialEntityMaybeWithId<T> = {
  _id?: string
} & PartialEntity<T>
export abstract class DbService<Entity> {
  constructor(private entityRepository: Repository<Entity>) {}

  async findOne(_id: string) {
    return this.entityRepository.findOne(_id)
  }

  async findOneBy(where: FindConditions<Entity>) {
    return this.entityRepository.findOne(where)
  }

  async findManyBy(where: FindManyOptions<Entity>) {
    return this.entityRepository.find(where)
  }

  async create(entity: PartialEntityMaybeWithId<Entity>) {
    entity._id || (entity._id = nanoid())

    return this.entityRepository.insert(entity)
  }

  async DANGEROUS_deleteAll() {
    return this.entityRepository.delete({})
  }
}

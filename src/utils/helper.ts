import * as bcrypt from 'bcryptjs'
import { HASH_ROUNDS } from './env'

type okOrDefaultParams = {
  func(): void
  onError?(error: Error): void
  defaultValue?: any
}
export function okOrDefault({
  func,
  onError,
  defaultValue = {},
}: okOrDefaultParams) {
  try {
    return func()
  } catch (error) {
    onError && onError(error)
    return defaultValue
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, HASH_ROUNDS)
}

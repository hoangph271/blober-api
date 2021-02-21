export enum APP_STAGES {
  DEV,
}

export const { USE_MEMORY_DB, SQLITE_DB_FILE = 'blober.db' } = process.env
export const { ALBUM_DIR, POST_DATA_FILE = '' } = process.env
export const { FS_ROOT = '.fs_root' } = process.env
export const HASH_ROUNDS = 12
export const STAGE = APP_STAGES.DEV
export const DEFAULT_TAKE_COUNT = 20
export const DATABASE = USE_MEMORY_DB ? ':memory:' : SQLITE_DB_FILE
export const JWT_SECRET = 'JWT_SECRET'
export const JWT_EXPIRES = '365d'

import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

export enum APP_STAGES {
  DEV,
}

const USE_MEMORY_DB = process.env.USE_MEMORY_DB || 1;
const SQLITE_DB_FILE = 'pussies.db';
const NOT_EXISTS_DB_FILE = !fs.existsSync(SQLITE_DB_FILE);

@Injectable()
export class Env {
  static HASH_ROUNDS = 12;
  static STAGE = APP_STAGES.DEV;
  static DEFAULT_TAKE_COUNT = 20;
  static DATABASE = USE_MEMORY_DB ? ':memory:' : SQLITE_DB_FILE;
  static JWT_SECRET = 'JWT_SECRET';
  static JWT_EXPIRES = '365d';
  static NEEDS_RESET_DB =
    USE_MEMORY_DB || NOT_EXISTS_DB_FILE || process.env.NEEDS_RESET_DB;
}

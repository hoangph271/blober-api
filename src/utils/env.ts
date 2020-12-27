import { Injectable } from '@nestjs/common';

export enum APP_STAGES {
  DEV,
}

@Injectable()
export class Env {
  static HASH_ROUNDS = 12;
  static STAGE = APP_STAGES.DEV;
  static DEFAULT_TAKE_COUNT = 20;
  static DATABASE = 0 ? ':memory:' : 'pussies.db';
  static JWT_SECRET = 'JWT_SECRET';
  static JWT_EXPIRES = '365d';

  static needsResetDb() {
    return process.env.NEEDS_RESET_DB;
  }
}

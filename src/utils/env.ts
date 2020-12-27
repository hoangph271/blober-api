import { Injectable } from '@nestjs/common';

export enum APP_STAGES {
  DEV,
}

@Injectable()
export class Env {
  static HASH_ROUNDS = 12;
  static STAGE = APP_STAGES.DEV;
  static DEFAULT_TAKE_COUNT = 20;

  static needsResetDb() {
    return process.env.NEEDS_RESET_DB || true;
  }
}

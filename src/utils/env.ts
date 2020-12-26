import { Injectable } from '@nestjs/common';

export enum APP_STAGES {
  DEV,
}

@Injectable()
export class Env {
  static HASH_ROUNDS = 12;
  static STAGE = APP_STAGES.DEV;

  static isNOTDev() {
    return Env.STAGE !== APP_STAGES.DEV;
  }

  static isDev() {
    return !Env.isNOTDev();
  }
}

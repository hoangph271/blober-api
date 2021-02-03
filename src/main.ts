import * as dotenv from 'dotenv'
dotenv.config()

import * as fs from 'fs'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { SeederService } from './tasks/seeder.service'
import { TasksModule } from './tasks/tasks.module'
import { DATABASE } from './utils/env'

const { USE_SEEDERS, DROP_DB } = process.env

;(async () => {
  if (USE_SEEDERS) {
    if (DROP_DB && fs.existsSync(DATABASE)) {
      console.info(`Deleting ${DATABASE}...!`)
      await fs.promises.unlink(DATABASE)
    }

    const app = await NestFactory.createApplicationContext(AppModule)
    const seedService = app
      .select(TasksModule)
      .get(SeederService, { strict: true })

    await seedService.seed()

    return app.close()
  }

  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  app.use(cookieParser())

  await app.listen(3000)
})()

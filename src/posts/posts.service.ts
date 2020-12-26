import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbService } from '../db.service';
import { Pic } from '../pics/pics.entity';
import { Env } from '../utils/env';
import { Repository } from 'typeorm';
import { Post } from './posts.entity';

@Injectable()
export class PostsService extends DbService<Post> implements OnModuleInit {
  constructor(
    @InjectRepository(Post)
    postRepository: Repository<Post>,
    @InjectRepository(Pic)
    private picRepository: Repository<Pic>,
  ) {
    super(postRepository);
  }

  async onModuleInit() {
    if (Env.isNOTDev()) return;

    await this.migrateAllPosts();
  }

  async migrateAllPosts(limit = 100) {
    console.time('POSTS_MIGRATION');

    if (Env.isDev()) {
      await this.DANGEROUS_deleteAll();
    }

    const path = await import('path');
    const fs = await import('fs/promises');
    const os = await import('os');
    const pLimit = ((await import('p-limit')) as unknown) as CallableFunction;

    const POST_DIR = 'Z:\\useShared\\useBad\\_savior\\posts';
    const DATA_FILE = 'info.json';
    const THREADS_PER_CPU = 4;
    const limiter = pLimit(os.cpus().length * THREADS_PER_CPU);

    const postDirs = (await fs.readdir(POST_DIR)).slice(0, limit);

    await Promise.all([
      ...postDirs.map((dirName) =>
        limiter(async () => {
          const dbPost = await this.findOneBy({ dirName });

          if (dbPost) return;

          const dirPath = path.join(POST_DIR, dirName);
          const dataPath = path.join(dirPath, DATA_FILE);
          const picPaths = (await fs.readdir(dirPath))
            .filter((fileName) => fileName !== DATA_FILE)
            .map((fileName) => path.join(dirPath, fileName));

          const json = await fs.readFile(dataPath, 'utf-8');
          const picsCount = picPaths.length - 1;
          const { Title: title = 'N/A' } = okOrDefault({
            func: () => JSON.parse(json),
            onError: (error) => {
              console.info(`Error parsing data file of ${dirPath}`);
              console.error(error);
            },
          });

          const { identifiers } = await this.create({
            title,
            dirName,
            picsCount,
          });
          const { uuid } = identifiers[0] as any;

          await Promise.all(
            picPaths.map(async (picPath) => {
              const fileName = path.basename(picPath);

              await this.picRepository.insert({
                fileName,
                post: { uuid },
                fileSize: (await fs.stat(picPath)).size,
              });
            }),
          );
        }),
      ),
    ]);

    console.info('All `posts` migration finished...!');
    console.timeEnd('POSTS_MIGRATION');
  }
}

type okOrDefaultParams = {
  func(): void;
  onError?(error: Error): void;
  defaultValue?: any;
};
function okOrDefault({ func, onError, defaultValue = {} }: okOrDefaultParams) {
  try {
    return func();
  } catch (error) {
    onError && onError(error);
    return defaultValue;
  }
}

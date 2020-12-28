import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbService } from '../db.service';
import { Blob } from '../blobs/blobs.entity';
import { Repository } from 'typeorm';
import { Album } from './albums.entity';
import { AlbumPic } from './albums.pic.entity';
import { imageMetadata } from '../utils/image';
import { NEEDS_RESET_DB } from '../utils/env';

@Injectable()
export class AlbumsService extends DbService<Album> implements OnModuleInit {
  constructor(
    @InjectRepository(Album)
    albumRepository: Repository<Album>,
    @InjectRepository(Blob)
    private blobRepository: Repository<Blob>,
    @InjectRepository(AlbumPic)
    private albumPicsRepository: Repository<AlbumPic>,
  ) {
    super(albumRepository);
  }

  async onModuleInit() {
    if (NEEDS_RESET_DB) await this.migrateAllAlbums();
  }

  async migrateAllAlbums(limit = 10) {
    console.time('ALBUMS_MIGRATION');

    await this.DANGEROUS_deleteAll();

    const path = await import('path');
    const fs = await import('fs/promises');
    const os = await import('os');
    const pLimit = ((await import('p-limit')) as unknown) as CallableFunction;

    const ALBUM_DIR = 'Z:\\useShared\\useBad\\_savior\\posts';
    const DATA_FILE = 'info.json';
    const THREADS_PER_CPU = 4;
    const limiter = pLimit(os.cpus().length * THREADS_PER_CPU);

    const albumDirs = (await fs.readdir(ALBUM_DIR)).slice(0, limit);

    await Promise.all([
      ...albumDirs.map((dirName) =>
        limiter(async () => {
          const dirPath = path.join(ALBUM_DIR, dirName);
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
            picsCount,
          });

          const [{ uuid: albumUuid }] = identifiers;

          const insertPromises = picPaths.map(async (blobPath) => {
            const { format, width, height } = await imageMetadata(blobPath);
            const contentType = `image/${format}`;
            const { identifiers } = await this.blobRepository.insert({
              blobPath,
              fileName: path.basename(blobPath),
              fileSize: (await fs.stat(blobPath)).size,
              contentType,
              metadata: JSON.stringify({ size: `${width}x${height}` }),
            });

            await this.albumPicsRepository.insert({
              album: { uuid: albumUuid },
              blobUuid: identifiers[0].uuid,
              title: path.basename(blobPath),
            });
          });

          await Promise.all(insertPromises);
        }),
      ),
    ]);

    console.info('All `albums` migration finished...!');
    console.timeEnd('ALBUMS_MIGRATION');
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

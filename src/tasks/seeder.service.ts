import * as path from 'path';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as pLimit from 'p-limit';
import { Injectable } from '@nestjs/common';
import { okOrDefault } from '../utils/helper';
import { imageMetadata } from '../utils/image';
import { AlbumsService } from '../albums/albums.service';
import { AlbumPicsService } from '../albums/albums.pic.service';
import { BlobsService } from '../blobs/blobs.service';
import { UsersService } from '../users/users.service';

const THREADS_PER_CPU = 4;
const limiter = pLimit(os.cpus().length * THREADS_PER_CPU);
const ALBUM_DIR = 'Z:\\useShared\\useBad\\_savior\\posts';
const DATA_FILE = 'info.json';

@Injectable()
export class SeederService {
  constructor(
    private albumsService: AlbumsService,
    private albumPicsService: AlbumPicsService,
    private blobsService: BlobsService,
    private usersService: UsersService,
  ) {}

  async seed() {
    console.info(`Seedin'...!`);

    console.time('Seed albums');
    await this.seedAlbums();
    console.timeEnd('Seed albums');

    console.time('Seed users');
    await this.seedUsers();
    console.timeEnd('Seed users');
  }

  async seedUsers() {
    this.usersService.create({
      fullName: 'fullName',
      username: 'username',
      password: 'password',
      isActive: true,
    });
  }

  async seedAlbums(limit = 10) {
    const albumPaths = (await childPaths(ALBUM_DIR)).slice(0, limit);

    await Promise.all([
      ...albumPaths.map((dirPath) =>
        limiter(async () => {
          const dataPath = path.join(dirPath, DATA_FILE);
          const picPaths = (await childPaths(dirPath)).filter(
            (fileName) => !fileName.endsWith(DATA_FILE),
          );

          const json = await fs.readFile(dataPath, 'utf-8');
          const picsCount = picPaths.length - 1;
          const { Title: title = 'N/A' } = okOrDefault({
            func: () => JSON.parse(json),
            onError: () => {
              console.info(`Error parsing data file of ${dirPath}`);
            },
          });

          // Create the album
          const {
            identifiers: [{ uuid: albumUuid }],
          } = await this.albumsService.create({
            title,
            picsCount,
          });

          // Create blobs & album pics
          const insertPromises = picPaths.map(async (blobPath) => {
            const { format, width, height } = await imageMetadata(blobPath);
            const contentType = `image/${format}`;
            const {
              identifiers: [{ uuid: blobUuid }],
            } = await this.blobsService.create({
              blobPath,
              fileName: path.basename(blobPath),
              fileSize: (await fs.stat(blobPath)).size,
              contentType,
              metadata: JSON.stringify({ size: `${width}x${height}` }),
            });

            await this.albumPicsService.create({
              album: { uuid: albumUuid },
              blobUuid,
              title: path.basename(blobPath),
            });
          });

          await Promise.all(insertPromises);
        }),
      ),
    ]);
  }
}

async function childPaths(dirPath: string) {
  const childNames = await fs.readdir(dirPath);

  return childNames.map((fileName) => path.join(dirPath, fileName));
}

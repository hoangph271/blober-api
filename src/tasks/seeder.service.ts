import * as path from 'path'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as pLimit from 'p-limit'
import { Injectable } from '@nestjs/common'
import { hashPassword, okOrDefault, walkDir } from '../utils/helper'
import { imageMetadata } from '../utils/image'
import { AlbumsService } from '../albums/albums.service'
import { AlbumPicsService } from '../albums/albums.pic.service'
import { BlobsService } from '../blobs/blobs.service'
import { UsersService } from '../users/users.service'
import { ALBUM_DIR, POST_DATA_FILE, FILE_DIRS } from '../utils/env'

const THREADS_PER_CPU = 4
const limiter = pLimit(os.cpus().length * THREADS_PER_CPU)

@Injectable()
export class SeederService {
  constructor(
    private albumsService: AlbumsService,
    private albumPicsService: AlbumPicsService,
    private blobsService: BlobsService,
    private usersService: UsersService,
  ) {}

  async seed() {
    console.info(`Seedin'...!`)

    console.time('Seed users')
    const [user] = await this.seedUsers()
    console.timeEnd('Seed users')

    console.time('Seed albums')
    await this.seedAlbums(user._id)
    console.timeEnd('Seed albums')

    console.time('Seed videos')
    await this.seedVideos(user._id)
    console.timeEnd('Seed videos')
  }

  async seedUsers() {
    const users = [
      {
        fullName: 'fullName',
        username: 'username',
        password: await hashPassword('password'),
        isActive: true,
      },
    ]

    return Promise.all(
      users.map(async (user) => {
        const existedUser = await this.usersService.findOneBy({
          username: user.username,
        })

        if (existedUser) return existedUser

        const { identifiers } = await this.usersService.create({
          fullName: 'fullName',
          username: 'username',
          password: await hashPassword('password'),
          isActive: true,
        })

        return {
          ...user,
          _id: identifiers[0]._id,
        }
      }),
    )
  }

  async seedAlbums(ownerId, limit = 100) {
    const albumPaths = (await childPaths(ALBUM_DIR)).slice(0, limit)

    await Promise.all([
      ...albumPaths.map((dirPath) =>
        limiter(async () => {
          const dataPath = path.join(dirPath, POST_DATA_FILE)
          const picPaths = (await childPaths(dirPath)).filter(
            (fileName) => !fileName.endsWith(POST_DATA_FILE),
          )
          const existedAlbumPic = await this.blobsService.findOneBy({
            blobPath: picPaths[0],
          })

          if (existedAlbumPic) {
            return console.info(`Album existed: ${dirPath}...!`)
          }

          const json = await fs.readFile(dataPath, 'utf-8')
          const picsCount = picPaths.length - 1
          const { Title: title = 'N/A' } = okOrDefault({
            func: () => JSON.parse(json),
            onError: () => {
              console.info(`Error parsing data file of ${dirPath}`)
            },
          })

          // Create the album
          const {
            identifiers: [{ _id: albumId }],
          } = await this.albumsService.create({
            ownerId,
            title,
            picsCount,
          })

          // Create blobs & album pics
          const insertPromises = picPaths.map(async (blobPath) => {
            const { format, width, height } = await imageMetadata(blobPath)
            const contentType = `image/${format}`
            const {
              identifiers: [{ _id: blobId }],
            } = await this.blobsService.create({
              ownerId,
              blobPath,
              fileName: path.basename(blobPath),
              fileSize: (await fs.stat(blobPath)).size,
              contentType,
              metadata: JSON.stringify({ size: `${width}x${height}` }),
            })

            await this.albumPicsService.create({
              album: { _id: albumId },
              blobId,
              title: path.basename(blobPath),
            })
          })

          await Promise.all(insertPromises)
        }),
      ),
    ])
  }

  async seedVideos(ownerId, limit = 10) {
    for (const dirPath of FILE_DIRS) {
      let filesCount = 0
      for await (const _ of await walkDir(dirPath)) {
        filesCount += 1
      }
      console.info(filesCount)
    }
  }
}

async function childPaths(dirPath: string) {
  const childNames = await fs.readdir(dirPath)

  return childNames.map((fileName) => path.join(dirPath, fileName))
}

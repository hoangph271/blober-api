import * as path from 'path'
import * as fs from 'fs/promises'
import { createReadStream } from 'fs'
import * as fileType from 'file-type'
import { spawn } from 'child_process'
import { Injectable } from '@nestjs/common'
import { FS_ROOTS } from '../utils/env'
import { Readable } from 'stream'

const fsEntries = FS_ROOTS.map((entry) => {
  return {
    itemPath: entry,
    isDir: true,
  }
})

export type FSItem = {
  itemPath: string
  isDir: boolean
  children?: FSItem[]
}

@Injectable()
export class FilesService {
  readRoot(): FSItem[] {
    return fsEntries
  }

  async readPath(itemPath: string): Promise<FSItem[] | FSItem> {
    const stats = await fs.stat(itemPath)

    if (stats.isFile()) {
      return {
        isDir: false,
        itemPath,
        ...(await fileType.fromFile(itemPath)),
      }
    }

    const childNames = await fs.readdir(itemPath)

    return Promise.all(
      childNames.map(async (childName) => {
        const childPath = path.join(itemPath, childName)
        const stats = await fs.stat(childPath)

        return {
          isDir: stats.isDirectory(),
          itemPath: childPath,
          ...(await fileType.fromFile(childPath)),
        }
      }),
    )
  }

  async previewStream(
    itemPath: string,
  ): Promise<{
    rs: Readable
    mime: string
  }> {
    const stats = await fs.stat(itemPath)

    if (stats.isDirectory()) {
      return {
        rs: createReadStream(path.join('icons', 'folder.svg')),
        mime: 'image/svg+xml',
      }
    }

    const { mime = '' } = (await fileType.fromFile(itemPath)) || {}

    switch (true) {
      case mime.startsWith('video/'): {
        return {
          rs: this._videoPreviewStream(itemPath),
          mime: 'image/png',
        }
      }
      default: {
        return {
          rs: createReadStream(path.join('icons', 'file-binary.svg')),
          mime: 'image/svg+xml',
        }
      }
    }
  }

  _videoPreviewStream(itemPath: string) {
    return spawn('ffmpeg', [
      '-i',
      itemPath,
      '-ss',
      '00:00:01.000',
      '-vframes',
      '1',
      '-f',
      'image2',
      'pipe:1',
    ]).stdout
  }
}

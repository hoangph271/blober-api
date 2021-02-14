import * as path from 'path'
import * as fs from 'fs/promises'
import * as fileType from 'file-type'
import { Injectable } from '@nestjs/common'
import { FS_ROOTS } from '../utils/env'

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
}

import * as path from 'path'
import * as fs from 'fs/promises'
import * as fsSync from 'fs'
import * as crypto from 'crypto'
import { Readable } from 'stream'
import { createReadStream } from 'fs'
import * as fileType from 'file-type'
import { spawn } from 'child_process'
import * as fsWalk from '@nodelib/fs.walk'
import { Injectable, Logger } from '@nestjs/common'
import { FS_ROOTS } from '../utils/env'

const CACHE_DIR = path.join('.fs_cache')
fs.access(CACHE_DIR, fsSync.constants.F_OK).catch(() => {
  fs.mkdir(CACHE_DIR)
})

const hash = (inStr: string) =>
  crypto.createHash('sha256').update(inStr).digest('hex')

const getRelativePath = (fullPath: string) => {
  const rootPath = FS_ROOTS.find((root) => fullPath.startsWith(root))

  return fullPath.replace(rootPath, '')
}

const fsRoot: FSItem = {
  _id: '',
  fullPath: '',
  path: '',
  mime: '',
  isDir: true,
  children: FS_ROOTS.map((path) => {
    return {
      _id: hash(path),
      path,
      isDir: true,
      fullPath: path,
    }
  }),
}

type FSWalkEntry = {
  name: string
  path: string
}
export type FSItem = {
  _id: string
  path: string
  fullPath: string
  mime?: string
  size?: number
  isDir: boolean
  children?: FSItem[]
}

@Injectable()
export class FilesService {
  async findPath(_id: string): Promise<string | undefined> {
    const fsItem = fsRoot.children.find((item) => item._id === _id)

    if (fsItem) {
      return fsItem.fullPath
    }

    for (const fsItem of fsRoot.children) {
      const walkStream = fsWalk.walkStream(fsItem.fullPath)

      for await (const entry of walkStream) {
        const { path } = entry as FSWalkEntry

        if (_id === hash(path)) return path
      }
    }
  }
  async readPath(_id: string): Promise<FSItem | undefined> {
    if (_id === '') {
      return fsRoot
    }

    const fullPath = await this.findPath(_id)

    if (!fullPath) return

    const stats = await fs.stat(fullPath)

    if (stats.isFile()) {
      return {
        _id: hash(fullPath),
        fullPath,
        path: getRelativePath(fullPath),
        isDir: false,
        mime: await this.getContentType(fullPath),
        ...(await fileType.fromFile(fullPath)),
      }
    }

    const childNames = await fs.readdir(fullPath)
    const children: FSItem[] = await Promise.all(
      childNames.map(async (childName) => {
        const childPath = path.join(fullPath, childName)

        try {
          const stats = await fs.stat(childPath)

          const fsItem: FSItem = {
            _id: hash(childPath),
            fullPath: childPath,
            path: getRelativePath(childPath),
            isDir: stats.isDirectory(),
            ...(stats.isDirectory()
              ? { mime: '' }
              : await fileType.fromFile(childPath)),
          }

          return fsItem
        } catch (error) {
          Logger.error(error)
          const fsItem: FSItem = {
            mime: '',
            isDir: false,
            _id: hash(fullPath),
            fullPath: childPath,
            path: getRelativePath(childPath),
          }

          return fsItem
        }
      }),
    )

    return {
      _id: hash(fullPath),
      mime: '',
      fullPath,
      path: getRelativePath(fullPath),
      children,
      isDir: true,
    }
  }

  async getStats(itemPath: string) {
    return fs.stat(itemPath)
  }

  async getContentType(itemPath: string) {
    const { mime = '' } = (await fileType.fromFile(itemPath)) || {}

    return mime
  }

  getFileReadable(itemPath: string, partial?: { start: number; end: number }) {
    return partial
      ? createReadStream(itemPath, { ...partial })
      : createReadStream(itemPath)
  }

  async previewStream(
    itemPath: string,
  ): Promise<{
    rs: Readable | null
    mime: string
  }> {
    const stats = await fs.stat(itemPath)

    if (stats.isDirectory()) {
      return { rs: null, mime: '' }
    }

    const { mime = '' } = (await fileType.fromFile(itemPath)) || {}

    switch (true) {
      case mime.startsWith('image/'): {
        return {
          rs: await fsSync.createReadStream(itemPath),
          mime,
        }
      }
      case mime.startsWith('video/'): {
        const rs = await this._videoPreviewStream(itemPath)

        return {
          rs: rs ?? null,
          mime: 'image/png',
        }
      }
      default: {
        return {
          rs: null,
          mime: null,
        }
      }
    }
  }

  async _videoPreviewStream(
    itemPath: string,
  ): Promise<fsSync.ReadStream | null> {
    const base64Path = Buffer.from(itemPath).toString('base64')
    const cachedPath = path.join(CACHE_DIR, base64Path)
    const existsCached = await fs
      .access(cachedPath, fsSync.constants.R_OK)
      .then(() => true)
      .catch(() => false)

    if (existsCached) {
      return fsSync.createReadStream(cachedPath)
    }

    return new Promise((resolve) => {
      spawn('ffmpeg', [
        '-i',
        itemPath,
        '-ss',
        '00:00:01.000',
        '-vframes',
        '1',
        '-f',
        'image2',
        cachedPath,
      ]).once('close', (code) => {
        if (code === 0) {
          resolve(fsSync.createReadStream(cachedPath))
        } else {
          console.error(`${itemPath}: ffmpeg failed with code ${code}`)
          resolve(null)
        }
      })
    })
  }
}

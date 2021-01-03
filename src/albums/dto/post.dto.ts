export class AlbumDto {
  _id: string
  title: string

  static buildPurified(dirtyAlbum: AlbumDto): AlbumDto {
    const { _id, title } = dirtyAlbum

    return {
      _id,
      title,
    }
  }
}

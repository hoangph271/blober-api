export class AlbumDto {
  uuid: string;
  title: string;

  static buildPurified(dirtyAlbum: AlbumDto): AlbumDto {
    const { uuid, title } = dirtyAlbum;

    return {
      uuid,
      title,
    };
  }
}

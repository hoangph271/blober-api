export class PostDto {
  uuid: string;
  title: string;

  static buildPurified(dirtyUser: PostDto): PostDto {
    const { uuid, title } = dirtyUser;

    return {
      uuid,
      title,
    };
  }
}

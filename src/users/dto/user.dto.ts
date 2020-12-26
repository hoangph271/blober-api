export class UserDto {
  uuid: string;
  fullName: string;
  username: string;
  isActive: boolean;

  static buildPurified(dirtyUser: UserDto): UserDto {
    const { uuid, isActive, username, fullName } = dirtyUser;

    return {
      uuid,
      isActive,
      username,
      fullName,
    };
  }
}

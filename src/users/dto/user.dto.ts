export class UserDto {
  _id: string
  fullName: string
  username: string
  isActive: boolean

  static buildPurified(dirtyUser: UserDto): UserDto {
    const { _id, isActive, username, fullName } = dirtyUser

    return {
      _id,
      isActive,
      username,
      fullName,
    }
  }
}

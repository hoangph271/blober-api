import { MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;

  @MinLength(8)
  username: string;

  @MinLength(8)
  password: string;
}

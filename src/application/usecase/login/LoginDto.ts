import { Trim } from 'class-sanitizer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MaxLength(30)
  @Trim()
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @Trim()
  password: string;

  constructor({ username, password }: LoginDto) {
    this.username = username;
    this.password = password;
  }
}

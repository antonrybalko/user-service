import { Trim } from 'class-sanitizer';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @Trim()
  username: string;

  @IsString()
  @MinLength(6)
  @Trim()
  password: string;

  constructor({ username, password }: LoginDto) {
    this.username = username;
    this.password = password;
  }
}

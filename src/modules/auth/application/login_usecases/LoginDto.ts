import { Trim } from 'class-sanitizer';
import { IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MaxLength(30)
  @Trim()
  username: string;

  @IsString()
  @MaxLength(30)
  @Trim()
  password: string;

  constructor({ username, password }: LoginDto) {
    this.username = username;
    this.password = password;
  }
}

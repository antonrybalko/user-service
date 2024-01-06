import { NormalizeEmail, Trim, Whitelist } from 'class-sanitizer';
import {
  IsString,
  MinLength,
  IsOptional,
  IsEmail,
  IsBoolean,
  ValidateIf,
  IsPhoneNumber,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Trim()
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @Trim()
  password: string;

  @ValidateIf((person: RegisterDto) => person.phoneNumber === undefined)
  @MaxLength(100)
  @IsEmail()
  @Trim()
  @NormalizeEmail()
  email: string;

  @ValidateIf((person: RegisterDto) => person.email === undefined)
  @IsPhoneNumber('RU')
  @Whitelist(/0123456789/)
  phoneNumber: string;

  @IsOptional()
  @IsBoolean()
  isVendor: boolean;

  constructor({
    username,
    password,
    email,
    phoneNumber,
    isVendor,
  }: RegisterDto) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.isVendor = isVendor;
  }
}

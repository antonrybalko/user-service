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
  Matches,
} from 'class-validator';

export class RegisterDto {
  @Matches(/^[a-zA-Z0-9_]+$/)
  @MinLength(3)
  @MaxLength(30)
  @Trim()
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @Trim()
  password: string;

  @ValidateIf((person: RegisterDto) => person.phone === undefined)
  @MaxLength(255)
  @IsEmail()
  @Trim()
  @NormalizeEmail()
  email?: string;

  @ValidateIf((person: RegisterDto) => person.email === undefined)
  @IsPhoneNumber('RU')
  @Whitelist(/0123456789/)
  phone?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(35)
  @Trim()
  firstname: string;

  @IsOptional()
  @IsString()
  @MaxLength(35)
  @Trim()
  lastname?: string;

  @IsOptional()
  @IsBoolean()
  isVendor?: boolean;

  constructor({
    username,
    password,
    email,
    phone,
    firstname,
    lastname,
    isVendor,
  }: RegisterDto) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.phone = phone;
    this.firstname = firstname;
    this.lastname = lastname;
    this.isVendor = isVendor;
  }
}

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
  @MaxLength(255)
  @IsEmail()
  @Trim()
  @NormalizeEmail()
  email?: string;

  @ValidateIf((person: RegisterDto) => person.email === undefined)
  @IsPhoneNumber('RU')
  @Whitelist(/0123456789/)
  phoneNumber?: string;

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
    phoneNumber,
    firstname,
    lastname,
    isVendor,
  }: RegisterDto) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.firstname = firstname;
    this.lastname = lastname;
    this.isVendor = isVendor;
  }
}

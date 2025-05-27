import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsPhoneNumber,
  MaxLength,
  MinLength,
  IsEnum,
  IsInt,
} from 'class-validator';
import { NormalizeEmail, Trim, Whitelist } from 'class-sanitizer';
import { UserStatuses } from 'entity/User';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Trim()
  username?: string;

  @IsOptional()
  @MaxLength(255)
  @IsEmail()
  @Trim()
  @NormalizeEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('RU')
  @Whitelist(/0123456789/)
  phone?: string;

  @IsOptional()
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
  isAdmin?: boolean;

  @IsOptional()
  @IsBoolean()
  isVendor?: boolean;

  @IsOptional()
  @IsInt()
  @IsEnum(UserStatuses)
  status?: number;

  constructor({
    username,
    email,
    phone,
    firstname,
    lastname,
    isAdmin,
    isVendor,
    status,
  }: UpdateUserDto) {
    this.username = username;
    this.email = email;
    this.phone = phone;
    this.firstname = firstname;
    this.lastname = lastname;
    this.isAdmin = isAdmin;
    this.isVendor = isVendor;
    this.status = status;
  }
}

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
import { UserStatuses } from 'domain/entity/User';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Trim()
  username?: string;

  @IsOptional()
  @MaxLength(100)
  @IsEmail()
  @Trim()
  @NormalizeEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('RU')
  @Whitelist(/0123456789/)
  phoneNumber?: string;

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
}

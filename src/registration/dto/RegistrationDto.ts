import { NormalizeEmail, Trim, Whitelist } from 'class-sanitizer';
import {
  IsString,
  MinLength,
  IsOptional,
  IsEmail,
  IsBoolean,
  ValidateIf,
  IsPhoneNumber,
} from 'class-validator';

export class RegistrationDto {
  @IsString()
  @Trim()
  username: string;

  @IsString()
  @MinLength(6)
  @Trim()
  password: string;

  @ValidateIf((person: RegistrationDto) => person.phoneNumber === undefined)
  @IsEmail()
  @Trim()
  @NormalizeEmail()
  email: string;

  @ValidateIf((person: RegistrationDto) => person.email === undefined)
  @IsPhoneNumber('RU')
  @Whitelist(/0123456789/)
  phoneNumber: string;

  @IsOptional()
  @IsBoolean()
  isVendor: boolean;
}

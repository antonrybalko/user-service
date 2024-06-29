import { NormalizeEmail, Trim, Whitelist } from 'class-sanitizer';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateOrganizationDto {
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  @Trim()
  title?: string;

  @IsOptional()
  @IsUUID()
  @Trim()
  cityGuid?: string;

  @IsOptional()
  @IsPhoneNumber('RU')
  @Whitelist(/0123456789/)
  phone?: string;

  @IsOptional()
  @MaxLength(255)
  @IsEmail()
  @NormalizeEmail()
  @Trim()
  email?: string;

  @IsOptional()
  @MaxLength(100)
  @Trim()
  registrationNumber?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  constructor({
    title,
    cityGuid,
    phone,
    email,
    registrationNumber,
    published,
  }: UpdateOrganizationDto) {
    this.title = title;
    this.cityGuid = cityGuid;
    this.phone = phone;
    this.email = email;
    this.registrationNumber = registrationNumber;
    this.published = published;
  }
}

import { NormalizeEmail, Trim, Whitelist } from 'class-sanitizer';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrganizationDto {
  @MinLength(3)
  @MaxLength(100)
  @Trim()
  title: string;

  @IsUUID()
  @Trim()
  cityGuid: string;

  @IsPhoneNumber('RU')
  @Whitelist(/0123456789/)
  phone: string;

  @MaxLength(255)
  @IsEmail()
  @NormalizeEmail()
  @Trim()
  email: string;

  @IsOptional()
  @MaxLength(1000)
  @Trim()
  description?: string;

  @IsOptional()
  @MaxLength(100)
  @Trim()
  registrationNumber?: string;

  constructor({
    title,
    cityGuid,
    phone,
    email,
    description,
    registrationNumber,
  }: CreateOrganizationDto) {
    this.title = title;
    this.cityGuid = cityGuid;
    this.phone = phone;
    this.email = email;
    this.description = description;
    this.registrationNumber = registrationNumber;
  }
}

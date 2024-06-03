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
  phoneNumber: string;

  @MaxLength(255)
  @IsEmail()
  @NormalizeEmail()
  @Trim()
  email: string;

  @IsOptional()
  @MaxLength(100)
  @Trim()
  registrationNumber?: string;

  constructor({
    title,
    cityGuid,
    phoneNumber,
    email,
    registrationNumber,
  }: CreateOrganizationDto) {
    this.title = title;
    this.cityGuid = cityGuid;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.registrationNumber = registrationNumber;
  }
}

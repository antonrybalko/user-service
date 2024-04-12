export class CreateOrganizationDto {
  title: string;
  cityGuid: string;
  phoneNumber: string;
  email: string;
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

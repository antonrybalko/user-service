import { Organization } from 'domain/entity/Organization';

export class OrganizationDto {
  constructor(
    public guid: string,
    public title: string,
    public cityGuid: string,
    public phoneNumber: string,
    public email: string,
    public status: string,
    public registrationNumber?: string,
  ) {}

  public static fromDomainEntity(organization: Organization): OrganizationDto {
    return new OrganizationDto(
      organization.guid,
      organization.title,
      organization.cityGuid,
      organization.phoneNumber,
      organization.email,
      organization.status,
      organization.registrationNumber,
    );
  }
}

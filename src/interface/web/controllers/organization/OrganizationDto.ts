import { Organization, OrganizationStatus } from 'domain/entity/Organization';

export class OrganizationDto {
  constructor(
    public guid: string,
    public title: string,
    public cityGuid: string,
    public phoneNumber: string,
    public email: string,
    public published: boolean,
    public status: 'active' | 'blocked',
    public registrationNumber?: string,
  ) {}

  public static fromDomainEntity(organization: Organization): OrganizationDto {
    return new OrganizationDto(
      organization.guid,
      organization.title,
      organization.cityGuid,
      organization.phoneNumber,
      organization.email,
      organization.published,
      organization.status === OrganizationStatus.ACTIVE ? 'active' : 'blocked',
      organization.registrationNumber,
    );
  }
}

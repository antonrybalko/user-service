import { OrganizationMember } from './OrganizationMember';
import { User } from './User';

export enum OrganizationStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export class Organization {
  constructor(
    public guid: string,
    public title: string,
    public cityGuid: string,
    public phone: string,
    public email: string,
    public createdByUser: User,
    public organizationMembers: OrganizationMember[],
    public registrationNumber?: string,
    public status: OrganizationStatus = OrganizationStatus.SUSPENDED,
  ) {}
}

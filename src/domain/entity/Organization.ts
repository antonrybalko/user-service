import { OrganizationMember } from './OrganizationMember';
import { User } from './User';

export enum OrganizationStatus {
  ACTIVE = 1,
  DELETED = 2,
  BLOCKED = 3,
}

export const DefaultOrganizationStatus = OrganizationStatus.ACTIVE;

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
    public published: boolean = false,
    public status: OrganizationStatus = DefaultOrganizationStatus,
  ) {}
}

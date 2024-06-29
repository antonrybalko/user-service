import { Organization, OrganizationStatus } from 'domain/entity/Organization';
import { UserStatus } from 'domain/entity/User';

class OrganizationShortDto {
  guid: string;
  title: string;
  cityGuid: string;
  phoneNumber: string;
  email: string;
  published: boolean;
  status: 'active' | 'blocked';
  registrationNumber?: string;
  static fromOrganization({
    guid,
    title,
    cityGuid,
    phoneNumber,
    email,
    registrationNumber,
    published,
    status,
  }: Organization): OrganizationShortDto {
    return {
      guid,
      title,
      cityGuid,
      phoneNumber,
      email,
      registrationNumber,
      published,
      status: status === OrganizationStatus.ACTIVE ? 'active' : 'blocked',
    };
  }
}

export class CurrentUserDto {
  guid: string;
  username: string;
  isAdmin: boolean;
  isVendor: boolean;
  status: 'active' | 'blocked';
  firstname: string;
  lastname?: string;
  phoneNumber?: string;
  email?: string;
  organizations: OrganizationShortDto[];

  constructor(user: {
    guid: string;
    username: string;
    isAdmin: boolean;
    isVendor: boolean;
    status: UserStatus;
    firstname: string;
    organizations: Organization[];
    lastname?: string;
    phoneNumber?: string;
    email?: string;
  }) {
    this.guid = user.guid;
    this.username = user.username;
    this.isAdmin = user.isAdmin;
    this.isVendor = user.isVendor;
    this.status = user.status === UserStatus.ACTIVE ? 'active' : 'blocked';
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.phoneNumber = user.phoneNumber;
    this.email = user.email;
    this.organizations = user.organizations.map(
      OrganizationShortDto.fromOrganization,
    );
  }

  static fromUserAndOrganization(
    user: {
      guid: string;
      username: string;
      isAdmin: boolean;
      isVendor: boolean;
      status: UserStatus;
      firstname: string;
      lastname?: string;
    },
    organizations: Organization[],
  ): CurrentUserDto {
    return new CurrentUserDto({
      ...user,
      organizations,
    });
  }
}

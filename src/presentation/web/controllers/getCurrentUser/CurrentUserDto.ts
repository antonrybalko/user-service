import { Organization, OrganizationStatus } from 'entity/Organization';
import { UserStatus } from 'entity/User';
import { UserImage } from 'entity/UserImage';

class OrganizationShortDto {
  guid: string;
  title: string;
  cityGuid: string;
  phone: string;
  email: string;
  published: boolean;
  status: 'active' | 'blocked';
  description?: string;
  registrationNumber?: string;
  static fromOrganization({
    guid,
    title,
    cityGuid,
    phone,
    email,
    description,
    registrationNumber,
    published,
    status,
  }: Organization): OrganizationShortDto {
    return {
      guid,
      title,
      cityGuid,
      phone,
      email,
      description,
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
  phone?: string;
  email?: string;
  organizations: OrganizationShortDto[];
  imageSmallUrl?: string;
  imageMediumUrl?: string;
  imageFullUrl?: string;

  constructor(user: {
    guid: string;
    username: string;
    isAdmin: boolean;
    isVendor: boolean;
    status: UserStatus;
    firstname: string;
    organizations: Organization[];
    lastname?: string;
    phone?: string;
    email?: string;
    userImage?: UserImage;
  }) {
    this.guid = user.guid;
    this.username = user.username;
    this.isAdmin = user.isAdmin;
    this.isVendor = user.isVendor;
    this.status = user.status === UserStatus.ACTIVE ? 'active' : 'blocked';
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.phone = user.phone;
    this.email = user.email;
    this.organizations = user.organizations.map(
      OrganizationShortDto.fromOrganization,
    );
    this.imageSmallUrl = user.userImage?.smallUrl;
    this.imageMediumUrl = user.userImage?.mediumUrl;
    this.imageFullUrl = user.userImage?.fullUrl;
  }

  static fromUserAndOrganizationsAndImages(
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
    userImage?: UserImage,
  ): CurrentUserDto {
    return new CurrentUserDto({
      ...user,
      organizations,
      userImage,
    });
  }
}

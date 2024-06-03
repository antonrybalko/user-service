import { UserStatus } from 'domain/entity/User';

export class CurrentUserDto {
  guid: string;
  username: string;
  isAdmin: boolean;
  isVendor: boolean;
  status: UserStatus;
  firstname: string;
  lastname?: string;

  constructor(user: {
    guid: string;
    username: string;
    isAdmin: boolean;
    isVendor: boolean;
    status: UserStatus;
    firstname: string;
    lastname?: string;
  }) {
    this.guid = user.guid;
    this.username = user.username;
    this.isAdmin = user.isAdmin;
    this.isVendor = user.isVendor;
    this.status = user.status;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
  }

  static fromUser(user: {
    guid: string;
    username: string;
    isAdmin: boolean;
    isVendor: boolean;
    status: UserStatus;
    firstname: string;
    lastname?: string;
  }): CurrentUserDto {
    return new CurrentUserDto(user);
  }
}

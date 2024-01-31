export class CurrentUserDto {
  guid: string;
  username: string;
  isAdmin: boolean;
  isVendor: boolean;

  constructor(user: {
    guid: string;
    username: string;
    isAdmin: boolean;
    isVendor: boolean;
  }) {
    this.guid = user.guid;
    this.username = user.username;
    this.isAdmin = user.isAdmin;
    this.isVendor = user.isVendor;
  }

  static fromUser(user: {
    guid: string;
    username: string;
    isAdmin: boolean;
    isVendor: boolean;
  }): CurrentUserDto {
    return new CurrentUserDto(user);
  }
}

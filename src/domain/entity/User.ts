export enum UserStatus {
  REGISTERED = 0,
  ACTIVE = 1,
  DELETED = 2,
  SUSPENDED = 3,
}

export const UserStatuses = [
  UserStatus.REGISTERED,
  UserStatus.ACTIVE,
  UserStatus.DELETED,
  UserStatus.SUSPENDED,
];

export const DefaultUserStatus = UserStatus.ACTIVE;

export class User {
  constructor(
    public guid: string,
    public username: string,
    public isAdmin: boolean,
    public isVendor: boolean,
    public firstname: string,
    public lastname?: string,
    public phoneNumber?: string,
    public email?: string,
    public oauthProvider?: string,
    public vkId?: string,
    public googleId?: string,
    public status: UserStatus = DefaultUserStatus,
  ) {}

  public isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  public isBlocked(): boolean {
    return this.status === UserStatus.SUSPENDED;
  }

  public isDeleted(): boolean {
    return this.status === UserStatus.DELETED;
  }
}

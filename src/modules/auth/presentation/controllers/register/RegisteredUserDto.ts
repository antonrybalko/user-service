import { User, UserStatus } from 'domain/entity/User';

export class RegisteredUserDto {
  constructor(
    public guid: string,
    public username: string,
    public isVendor: boolean,
    public status: UserStatus,
    public firstname: string,
    public lastname?: string,
    public email?: string,
    public phone?: string,
  ) {}

  public static fromDomainEntity(user: User): RegisteredUserDto {
    return new RegisteredUserDto(
      user.guid,
      user.username,
      user.isVendor,
      user.status,
      user.firstname,
      user.lastname,
      user.email,
      user.phone,
    );
  }
}

import { UserStatus } from '../entity/User';

export class RegisteredUserDto {
  guid: string;
  username: string;
  email: string;
  phoneNumber: string;
  isVendor: boolean;
  status: UserStatus;

  constructor({
    guid,
    username,
    email,
    phoneNumber,
    isVendor,
    status,
  }: RegisteredUserDto) {
    this.guid = guid;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.isVendor = isVendor;
    this.status = status;
  }
}

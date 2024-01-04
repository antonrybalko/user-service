import User from '../entity/User';

export interface RegistrationRepositoryInterface {
  checkIfUserExists(username: string): Promise<boolean>;
  checkIfEmailOrPhoneExists(
    email: string,
    phoneNumber: string,
  ): Promise<boolean>;
  createUser(
    username: string,
    password: string,
    email: string,
    phoneNumber: string,
    isVendor: boolean,
  ): Promise<User>;
}

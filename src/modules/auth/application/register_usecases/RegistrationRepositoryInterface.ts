import { User } from 'modules/user/domain/User';

export interface RegistrationRepositoryInterface {
  checkIfUserExists(username: string): Promise<boolean>;
  checkIfEmailOrPhoneExists(email?: string, phone?: string): Promise<boolean>;
  createUser(
    username: string,
    password: string,
    firstname: string,
    lastname?: string,
    email?: string,
    phone?: string,
    isVendor?: boolean,
  ): Promise<User>;
}

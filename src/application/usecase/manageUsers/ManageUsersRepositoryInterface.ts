import { User } from 'domain/entity/User';

export interface ManageUsersRepositoryInterface {
  findAll(): Promise<User[]>;
  findByGuid(guid: string): Promise<User>;
  updateUser(
    guid: string,
    username?: string,
    email?: string,
    phoneNumber?: string,
    firstname?: string,
    lastname?: string,
    isAdmin?: boolean,
    isVendor?: boolean,
    status?: number,
  ): Promise<User>;
  deleteUser(guid: string): Promise<boolean>;
  checkIfUserExists(guid: string): Promise<boolean>;
}

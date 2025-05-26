import { User } from 'domain/entity/User';

export interface UserRepositoryInterface {
  findAll(): Promise<User[]>;
  findByGuid(guid: string): Promise<User>;
  updateUser(
    guid: string,
    username?: string,
    email?: string,
    phone?: string,
    firstname?: string,
    lastname?: string,
    isAdmin?: boolean,
    isVendor?: boolean,
    status?: number,
  ): Promise<User>;
  deleteUser(guid: string): Promise<boolean>;
  checkIfUserExists(guid: string): Promise<boolean>;
}

import { Service } from 'typedi';
import { User } from 'entity/User';
import { UserRepositoryInterface } from 'application/user/port/UserRepositoryInterface';
import { BaseUserRepository } from './BaseUserRepository';
import { NotFoundException } from 'shared/exception/NotFoundException';

@Service()
export class UserRepository
  extends BaseUserRepository
  implements UserRepositoryInterface
{
  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users.map((user) => user.toDomainEntity());
  }

  async findByGuid(guid: string): Promise<User> {
    const user = await this.findUserByGuid(guid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.toDomainEntity();
  }

  async updateUser(
    guid: string,
    username?: string,
    email?: string,
    phone?: string,
    firstname?: string,
    lastname?: string,
    isAdmin?: boolean,
    isVendor?: boolean,
    status?: number,
  ): Promise<User> {
    const userToUpdate = await this.userRepository.findOne({ where: { guid } });
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    if (username !== undefined) userToUpdate.username = username;
    if (email !== undefined) userToUpdate.email = email;
    if (phone !== undefined) userToUpdate.phone = phone;
    if (firstname !== undefined) userToUpdate.firstname = firstname;
    if (lastname !== undefined) userToUpdate.lastname = lastname;
    if (isAdmin !== undefined) userToUpdate.isAdmin = isAdmin;
    if (isVendor !== undefined) userToUpdate.isVendor = isVendor;
    if (status !== undefined) userToUpdate.status = status;

    await this.userRepository.save(userToUpdate);
    return userToUpdate.toDomainEntity();
  }

  async deleteUser(guid: string): Promise<boolean> {
    const deleteResult = await this.userRepository.delete({ guid });
    return (
      deleteResult.affected !== null &&
      deleteResult.affected !== undefined &&
      deleteResult.affected > 0
    );
  }

  async checkIfUserExists(guid: string): Promise<boolean> {
    const userExists = await this.findUserByGuid(guid);
    return !!userExists;
  }
}

import { User, DefaultUserStatus } from 'entity/User';
import { UserEntity } from 'adapter/persistence/entity/UserEntity';
import { RegistrationRepositoryInterface } from 'application/register/port/RegistrationRepositoryInterface';
import { Service } from 'typedi';
import { BaseUserRepository } from './BaseUserRepository';

@Service()
export class RegistrationRepository
  extends BaseUserRepository
  implements RegistrationRepositoryInterface
{
  async checkIfUserExists(username: string): Promise<boolean> {
    const usernameExists = await this.findUserByUsername(username);
    return !!usernameExists;
  }

  async checkIfEmailOrPhoneExists(
    email?: string,
    phone?: string,
  ): Promise<boolean> {
    const emailOrPhoneExists = await this.userRepository.findOne({
      where: [{ email }, { phone }],
    });
    return !!emailOrPhoneExists;
  }

  async createUser(
    username: string,
    password: string,
    firstname: string,
    lastname?: string,
    email?: string,
    phone?: string,
    isVendor?: boolean,
  ): Promise<User> {
    const user = new UserEntity();
    user.username = username;
    user.password = password;
    user.email = email;
    user.phone = phone;
    user.isVendor = isVendor;
    user.firstname = firstname;
    user.lastname = lastname;
    user.status = DefaultUserStatus;

    const userCreated = await this.userRepository.save(user);
    return userCreated.toDomainEntity();
  }
}

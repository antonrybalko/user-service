import User, { DefaultUserStatus } from 'domain/entity/User';
import { UserEntity } from 'infrastructure/persistence/entity/UserEntity';
import { RegistrationRepositoryInterface } from 'application/usecase/register/RegistrationRepositoryInterface';
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
    email: string,
    phoneNumber: string,
  ): Promise<boolean> {
    const emailOrPhoneExists = await this.userRepository.findOne({
      where: [{ email }, { phoneNumber }],
    });
    return !!emailOrPhoneExists;
  }

  async createUser(
    username: string,
    password: string,
    email: string,
    phoneNumber: string,
    isVendor: boolean,
  ): Promise<User> {
    // Create and save the user
    const user = new UserEntity();
    user.username = username;
    user.password = password;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.isVendor = isVendor;
    user.status = DefaultUserStatus;

    const userCreated = await this.userRepository.save(user);
    return userCreated.toDomainEntity();
  }
}

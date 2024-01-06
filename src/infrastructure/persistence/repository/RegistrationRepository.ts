import { Repository } from 'typeorm';
import User, { DefaultUserStatus } from 'domain/entity/User';
import { UserEntity } from 'infrastructure/persistence/entity/UserEntity';
import { AppDataSource } from '../data-source';
import { RegistrationRepositoryInterface } from 'application/usecase/register/RegistrationRepositoryInterface';
import { Service } from 'typedi';

@Service()
export class RegistrationRepository implements RegistrationRepositoryInterface {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
  }

  async checkIfUserExists(username: string): Promise<boolean> {
    // Check for existing user
    const usernameExists = await this.userRepository.findOne({
      where: [{ username }],
    });
    return !!usernameExists;
  }

  async checkIfEmailOrPhoneExists(
    email: string,
    phoneNumber: string,
  ): Promise<boolean> {
    // Check for existing user
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

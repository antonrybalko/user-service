import { RegistrationRepositoryInterface } from './RegistrationRepositoryInterface';
import { ConflictException } from '../../shared/exception/ConflictException';
import { Inject, Service } from 'typedi';
import User from 'entity/User';
import { PasswordServiceInterface } from 'application/PasswordServiceInterface';

type RegistrationData = {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  isVendor: boolean;
};

@Service()
export class RegistrationService {
  @Inject('RegistrationRepositoryInterface')
  private registrationRepository: RegistrationRepositoryInterface;

  @Inject('PasswordServiceInterface')
  private passwordService: PasswordServiceInterface;

  async registerUser(userData: RegistrationData): Promise<User> {
    if (
      await this.registrationRepository.checkIfUserExists(userData.username)
    ) {
      throw new ConflictException('User with this username already exists');
    }

    if (
      await this.registrationRepository.checkIfEmailOrPhoneExists(
        userData.email,
        userData.phoneNumber,
      )
    ) {
      throw new ConflictException(
        'User with this email or phone number already exists.',
      );
    }

    const { username, password, email, phoneNumber, isVendor } = userData;
    const hashedPassword = await this.passwordService.hashPassword(password);

    return await this.registrationRepository.createUser(
      username,
      hashedPassword,
      email,
      phoneNumber,
      isVendor,
    );
  }
}

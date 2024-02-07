import { RegistrationRepositoryInterface } from './RegistrationRepositoryInterface';
import { ConflictException } from 'shared/exception/ConflictException';
import { Inject, Service } from 'typedi';
import User from 'domain/entity/User';
import { PasswordServiceInterface } from 'application/services/PasswordServiceInterface';
import { RegisterDto } from './RegisterDto';
import BaseUseCaseService from 'application/usecase/shared/BaseUseCaseService';

@Service()
export class RegistrationService extends BaseUseCaseService {
  @Inject('RegistrationRepositoryInterface')
  private registrationRepository: RegistrationRepositoryInterface;

  @Inject('PasswordServiceInterface')
  private passwordService: PasswordServiceInterface;

  async registerUser(userData: RegisterDto): Promise<User> {
    await this.validate(userData);

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

    const {
      username,
      password,
      email,
      phoneNumber,
      isVendor,
      firstname,
      lastname,
    } = userData;
    const hashedPassword = await this.passwordService.hashPassword(password);

    return await this.registrationRepository.createUser(
      username,
      hashedPassword,
      firstname,
      lastname,
      email,
      phoneNumber,
      isVendor,
    );
  }
}

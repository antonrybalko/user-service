import { RegistrationRepositoryInterface } from './port/RegistrationRepositoryInterface';
import { ConflictException } from 'shared/exception/ConflictException';
import { Inject, Service } from 'typedi';
import { User } from 'entity/User';
import { PasswordServiceInterface } from 'application/shared/port/PasswordServiceInterface';
import { RegisterDto } from './dto/RegisterDto';
import BaseUseCaseService from 'application/shared/BaseUseCaseService';
import {
  RegistrationRepositoryInterfaceToken,
  PasswordServiceInterfaceToken,
} from 'di/tokens';

@Service()
export class RegistrationService extends BaseUseCaseService {
  @Inject(RegistrationRepositoryInterfaceToken)
  private registrationRepository!: RegistrationRepositoryInterface;

  @Inject(PasswordServiceInterfaceToken)
  private passwordService!: PasswordServiceInterface;

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
        userData.phone,
      )
    ) {
      throw new ConflictException(
        'User with this email or phone number already exists',
      );
    }

    const { username, password, email, phone, isVendor, firstname, lastname } =
      userData;
    const hashedPassword = await this.passwordService.hashPassword(password);

    return await this.registrationRepository.createUser(
      username,
      hashedPassword,
      firstname,
      lastname,
      email,
      phone,
      isVendor,
    );
  }
}

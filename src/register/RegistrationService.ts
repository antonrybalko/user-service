import { RegistrationRepository } from './RegistrationRepository';
import { RegisterDto } from './RegisterDto';
import { RegisteredUserDto } from './RegisteredUserDto';
import { ConflictException } from '@core/exception/ConflictException';

export class RegistrationService {
  constructor(private registrationRepository = new RegistrationRepository()) {}

  async registerUser(userData: RegisterDto): Promise<RegisteredUserDto> {
    if (await this.registrationRepository.checkIfUserExists(userData)) {
      throw new ConflictException('User with this username already exists');
    }

    if (await this.registrationRepository.checkIfEmailOrPhoneExists(userData)) {
      throw new ConflictException(
        'User with this email or phone number already exists.',
      );
    }

    const user = await this.registrationRepository.createUser(userData);

    return new RegisteredUserDto(user);
  }
}

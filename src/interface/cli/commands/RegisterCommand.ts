import { Command } from 'commander';
import { Inject, Service } from 'typedi';
import { RegistrationService } from 'application/usecase/register/RegistrationService';
import { RegisterDto } from 'application/usecase/register/RegisterDto';
import BaseCommand from './BaseCommand';

export interface RegisterCommandOptions {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  isVendor: boolean;
}

@Service()
export class RegisterCommand extends BaseCommand {
  @Inject('RegistrationService')
  private registrationService: RegistrationService;

  async execute(
    program: Command,
    options: RegisterCommandOptions,
  ): Promise<void> {
    const registerDto = new RegisterDto({
      username: options.username,
      password: options.password,
      email: options.email,
      phoneNumber: options.phoneNumber,
      isVendor: options.isVendor,
    });

    try {
      const registeredUser =
        await this.registrationService.registerUser(registerDto);
      /* eslint-disable-next-line no-console */
      console.log('User successfully registered: ', registeredUser);
    } catch (error) {
      this.handleError(program, error);
    }
  }
}

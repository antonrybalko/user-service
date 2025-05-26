import { Command } from 'commander';
import { Inject, Service } from 'typedi';
import { RegistrationService } from 'application/usecase/register/RegistrationService';
import { RegisterDto } from 'application/usecase/register/RegisterDto';
import BaseCommand from '../BaseCommand';

@Service()
export default class RegisterCommand extends BaseCommand {
  @Inject()
  private registrationService: RegistrationService;

  async execute(program: Command, options: RegisterDto): Promise<void> {
    try {
      const registeredUser = await this.registrationService.registerUser(
        new RegisterDto(options),
      );
      // eslint-disable-next-line no-console
      console.log('User successfully registered: ', registeredUser);
    } catch (error) {
      this.handleError(program, error);
    }
  }
}

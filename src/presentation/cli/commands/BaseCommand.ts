import { Inject } from 'typedi';
import { ConflictException } from 'shared/exception/ConflictException';
import { UnauthorizedException } from 'shared/exception/UnauthorizedException';
import { ValidatorInterface } from 'shared/port/ValidatorInterface';
import { Command } from 'commander';
import { NotFoundException } from 'shared/exception/NotFoundException';
import { ValidatorInterfaceToken } from 'di/tokens';

export default abstract class BaseCommand {
  @Inject(ValidatorInterfaceToken)
  protected validator!: ValidatorInterface;

  protected async handleError(program: Command, error: unknown): Promise<void> {
    if (this.validator.isValidationError(error)) {
      program.error(this.validator.validationErrorToMessage(error), {
        exitCode: 1,
      });
    } else if (error instanceof ConflictException) {
      program.error(error.message, { exitCode: 2 });
    } else if (error instanceof UnauthorizedException) {
      program.error(error.message, { exitCode: 3 });
    } else if (error instanceof NotFoundException) {
      program.error(error.message, { exitCode: 4 });
    } else {
      throw error;
    }
  }
}

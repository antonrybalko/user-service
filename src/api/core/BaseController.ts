import { Inject, Service } from 'typedi';
import { Response } from 'express';
import { LoggerInterface } from '@core/interface/LoggerInterface';
import { ConflictException } from '@core/exception/ConflictException';
import { ValidatorInterface } from './interface/ValidatorInterface';
import { SanitizerInterface } from './interface/SanitizerInterface';

@Service()
class BaseController {
  @Inject('LoggerInterface')
  private logger: LoggerInterface;

  @Inject('ValidatorInterface')
  protected validator: ValidatorInterface;

  @Inject('SanitizerInterface')
  protected sanitizer: SanitizerInterface;

  protected async validate(dto: object): Promise<void> {
    await this.validator.validate(this.sanitizer.sanitize(dto));
  }

  protected async handleError(
    response: Response,
    error: unknown,
  ): Promise<Response> {
    if (this.validator.isValidationError(error)) {
      return response.status(400).json({ errors: error });
    } else if (error instanceof ConflictException) {
      return response.status(409).json({ error: error.message });
    } else {
      this.logger.error(error);
      return response.status(500).json({ error: 'Unknown error' });
    }
  }
}

export default BaseController;

import { Service } from 'typedi';
import { ValidationError, Validator } from 'class-validator';
import { ValidatorInterface } from '@core/api/interface/ValidatorInterface';

@Service()
export class ValidatorService implements ValidatorInterface {
  public constructor(private validator = new Validator()) {}

  public async validate(dto: object): Promise<void> {
    return this.validator.validateOrReject(dto);
  }

  public isValidationError(error: unknown): boolean {
    return error instanceof Array && error[0] instanceof ValidationError;
  }
}

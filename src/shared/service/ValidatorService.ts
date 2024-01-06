import { Service } from 'typedi';
import { ValidationError, Validator } from 'class-validator';
import { ValidatorInterface } from '../interface/ValidatorInterface';

@Service()
export class ValidatorService implements ValidatorInterface {
  public constructor(private validator = new Validator()) {}

  public async validate(dto: object): Promise<void> {
    return this.validator.validateOrReject(dto);
  }

  public isValidationError(error: unknown): boolean {
    return error instanceof Array && error[0] instanceof ValidationError;
  }

  public validationErrorToMessage(error: unknown): string {
    if (!this.isValidationError(error)) {
      return 'Unknown error';
    }

    const validationErrors = error as ValidationError[];
    const constraints = validationErrors[0].constraints ?? {};
    const property = validationErrors[0].property ?? '';
    const message = Object.values(constraints).join(', ');
    return `Validation Error for property "${property}": ${message}`;
  }
}

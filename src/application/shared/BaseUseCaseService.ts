import { Service, Inject } from 'typedi';
import { ValidatorInterface } from 'shared/port/ValidatorInterface';
import { SanitizerInterface } from 'shared/port/SanitizerInterface';
import { ValidatorInterfaceToken, SanitizerInterfaceToken } from 'di/tokens';

@Service()
export default abstract class BaseUseCaseService {
  @Inject(ValidatorInterfaceToken)
  protected validator!: ValidatorInterface;

  @Inject(SanitizerInterfaceToken)
  protected sanitizer!: SanitizerInterface;

  protected async validate(dto: object): Promise<void> {
    await this.validator.validate(this.sanitizer.sanitize(dto));
  }
}

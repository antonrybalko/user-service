import { Service, Inject } from 'typedi';
import { ValidatorInterface } from 'shared/interface/ValidatorInterface';
import { SanitizerInterface } from 'shared/interface/SanitizerInterface';

@Service()
export default abstract class BaseUseCaseService {
  @Inject('ValidatorInterface')
  protected validator: ValidatorInterface;

  @Inject('SanitizerInterface')
  protected sanitizer: SanitizerInterface;

  protected async validate(dto: object): Promise<void> {
    await this.validator.validate(this.sanitizer.sanitize(dto));
  }
}

import { Sanitizer } from 'class-sanitizer';
import { Service } from 'typedi';
import { SanitizerInterface } from '../../shared/port/SanitizerInterface';

@Service()
export class SanitizerService implements SanitizerInterface {
  public constructor(private sanitizer = new Sanitizer()) {}

  public sanitize(dto: object): object {
    return this.sanitizer.sanitize(dto);
  }
}

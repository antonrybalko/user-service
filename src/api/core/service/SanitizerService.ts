import { Sanitizer } from 'class-sanitizer';
import { Service } from 'typedi';
import { SanitizerInterface } from '../interface/SanitizerInterface';

@Service()
export class SanitizerService implements SanitizerInterface {
  public constructor(private sanitizer = new Sanitizer()) {}

  public sanitize(dto: object): object {
    return this.sanitizer.sanitize(dto);
  }
}

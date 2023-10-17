import { Service } from 'typedi';
import { Logger } from 'tslog';
import { LoggerInterface } from '@core/interface/LoggerInterface';

@Service()
export class LoggerService implements LoggerInterface {
  constructor(private logger = new Logger()) {}

  async error(message: unknown): Promise<void> {
    this.logger.error(message);
  }
}

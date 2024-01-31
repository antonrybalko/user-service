import { Service } from 'typedi';
import { Logger } from 'tslog';
import { LoggerInterface } from 'shared/interface/LoggerInterface';

const prettyLogTemplate = '{{dateIsoStr}}\t[{{logLevelName}}]\t';

@Service()
export class LoggerService implements LoggerInterface {
  constructor(private logger = new Logger({ prettyLogTemplate })) {}

  async error(message: unknown): Promise<void> {
    this.logger.error(message);
  }

  async info(message: string): Promise<void> {
    this.logger.info(message);
  }
}

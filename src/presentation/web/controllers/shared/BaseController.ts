import { Inject, Service } from 'typedi';
import { Response } from 'express';
import { LoggerInterface } from 'shared/port/LoggerInterface';
import { ConflictException } from 'shared/exception/ConflictException';
import { ValidatorInterface } from 'shared/port/ValidatorInterface';
import { SanitizerInterface } from 'shared/port/SanitizerInterface';
import { UnauthorizedException } from 'shared/exception/UnauthorizedException';
import { NotFoundException } from 'shared/exception/NotFoundException';
import { TokenPayload } from 'entity/TokenPayload';
import { RequestInterface } from 'presentation/web/middleware/RequestInterface';
import {
  LoggerInterfaceToken,
  ValidatorInterfaceToken,
  SanitizerInterfaceToken,
} from 'di/tokens';

@Service()
class BaseController {
  @Inject(LoggerInterfaceToken)
  private logger!: LoggerInterface;

  @Inject(ValidatorInterfaceToken)
  protected validator!: ValidatorInterface;

  @Inject(SanitizerInterfaceToken)
  protected sanitizer!: SanitizerInterface;

  protected async validate(dto: object): Promise<void> {
    await this.validator.validate(this.sanitizer.sanitize(dto));
  }

  protected async getTokenPayload(
    req: RequestInterface,
  ): Promise<TokenPayload> {
    if (!req.tokenPayload) {
      throw new UnauthorizedException('No token payload found.');
    }
    return req.tokenPayload;
  }

  protected async handleError(
    response: Response,
    error: unknown,
  ): Promise<Response> {
    if (this.validator.isValidationError(error)) {
      return response.status(400).json({ errors: error });
    } else if (error instanceof NotFoundException) {
      return response.status(404).json({ error: error.message });
    } else if (error instanceof ConflictException) {
      return response.status(409).json({ error: error.message });
    } else if (error instanceof UnauthorizedException) {
      return response.status(401).json({ error: error.message });
    } else {
      this.logger.error(error);
      return response.status(500).json({ error: 'Unknown error' });
    }
  }
}

export default BaseController;

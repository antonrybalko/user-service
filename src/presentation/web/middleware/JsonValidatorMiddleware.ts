import { Inject, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { LoggerInterface } from 'shared/port/LoggerInterface';
import { LoggerInterfaceToken } from 'di/tokens';

@Service()
export class JsonValidatorMiddleware {
  @Inject(LoggerInterfaceToken)
  private logger!: LoggerInterface;

  validateJson(req: Request, res: Response, next: NextFunction) {
    // This middleware will be called after express.json() has already parsed the body
    // If we reach here, JSON parsing was successful, so we just continue
    next();
  }

  handleJsonError(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (
      err instanceof SyntaxError &&
      (err as { status?: number }).status === 400 &&
      'body' in err
    ) {
      this.logger.error(`JSON parsing error: ${err.message}`);
      return res.status(400).json({
        error: 'Invalid JSON format',
        message: err.message,
      });
    }
    next(err);
  }
}

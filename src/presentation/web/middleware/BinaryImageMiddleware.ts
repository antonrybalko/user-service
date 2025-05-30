import { Request, Response, NextFunction, raw } from 'express';
import { Inject, Service } from 'typedi';
import { LoggerInterface } from 'shared/port/LoggerInterface';
import { LoggerInterfaceToken } from 'di/tokens';

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 2MB in bytes

interface ParserError {
  type: string;
}

@Service()
export class BinaryImageMiddleware {
  @Inject(LoggerInterfaceToken)
  private logger!: LoggerInterface;

  public parseBinaryBody(req: Request, res: Response, next: NextFunction) {
    const middleware = raw({
      limit: MAX_UPLOAD_SIZE,
      type: ['image/jpeg', 'image/png'],
    });
    return middleware(req, res, next);
  }

  public handleParseError(
    err: ParserError,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (err.type === 'entity.too.large') {
      return res.status(413).json({
        error: 'Image too large',
      });
    }
    if (err) {
      this.logger.error(err);
      return res.status(500).json({
        error: 'Internal error',
      });
    }
    next();
  }
}

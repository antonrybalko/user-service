import jwt from 'jsonwebtoken';
import { Inject, Service } from 'typedi';
import { NextFunction, Response } from 'express';
import { TokenPayload, RequestInterface } from './RequestInterface';
import { LoggerInterface } from '../../../shared/interface/LoggerInterface';

@Service()
export class AuthenticateMiddleware {
  @Inject('LoggerInterface')
  private logger: LoggerInterface;

  async authenticate(req: RequestInterface, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
        if (err) {
          this.logger.error(err);
          return res.sendStatus(401);
        }

        req.tokenPayload = payload as TokenPayload;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  }
}

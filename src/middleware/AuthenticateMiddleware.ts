import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { AuthUser, RequestInterface } from './RequestInterface';
import { Inject, Service } from 'typedi';
import { LoggerInterface } from '../interface/LoggerInterface';

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

        req.user = payload;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  }
}

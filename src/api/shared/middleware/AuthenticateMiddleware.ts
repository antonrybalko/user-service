import jwt from 'jsonwebtoken';
import { Inject, Service } from 'typedi';
import { NextFunction, Response } from 'express';
import { RequestInterface } from './RequestInterface';
import { LoggerInterface } from '../../../shared/interface/LoggerInterface';
import TokenPayload from 'entity/TokenPayload';
import { In } from 'typeorm';
import { TokenServiceInterface } from 'application/TokenServiceInterface';

@Service()
export class AuthenticateMiddleware {
  @Inject('LoggerInterface')
  private logger: LoggerInterface;

  @Inject('TokenServiceInterface')
  private tokenService: TokenServiceInterface;

  async authenticate(req: RequestInterface, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        req.tokenPayload = this.tokenService.verifyToken(token);
        next();
      } catch (error) {
        this.logger.error(error);
        return res.sendStatus(401);
      }

      // jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
      //   if (err) {
      //     this.logger.error(err);
      //     return res.sendStatus(401);
      //   }

      //   req.tokenPayload = payload as TokenPayload;
      //   next();
      // });
    } else {
      res.sendStatus(401);
    }
  }
}

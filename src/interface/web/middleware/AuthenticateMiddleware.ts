import { Inject, Service } from 'typedi';
import { NextFunction, Response } from 'express';
import { LoggerInterface } from '../../../shared/interface/LoggerInterface';
import { TokenServiceInterface } from '../../../application/services/TokenServiceInterface';
import { RequestInterface } from './RequestInterface';

@Service()
export class AuthenticateMiddleware {
  @Inject('LoggerInterface')
  private logger: LoggerInterface;

  @Inject('TokenServiceInterface')
  private tokenService: TokenServiceInterface;

  async authenticate(req: RequestInterface, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: 'Authorization header missing',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    try {
      req.tokenPayload = this.tokenService.verifyToken(token);
      next();
    } catch (error) {
      this.logger.error(error);
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}

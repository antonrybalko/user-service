import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import User from '../../domain/entity/User';
import TokenPayload from '../../domain/valueObject/TokenPayload';
import { TokenServiceInterface } from '../../application/services/TokenServiceInterface';

@Service()
export class TokenService implements TokenServiceInterface {
  generateToken(user: User): string {
    const payload: TokenPayload = {
      guid: user.guid,
      username: user.username,
    };
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN as string,
    });
  }

  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
  }
}

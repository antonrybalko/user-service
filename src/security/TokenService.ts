import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import User from 'entity/User';
import TokenPayload from 'entity/TokenPayload';
import { TokenServiceInterface } from 'application/TokenServiceInterface';

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

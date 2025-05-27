import jwt from 'jsonwebtoken';
import { isUUID } from 'class-validator';
import { Service } from 'typedi';
import { User } from 'modules/user/domain/User';
import { TokenPayload } from 'modules/auth/domain/TokenPayload';
import { TokenServiceInterface } from '../application/TokenServiceInterface';

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
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenPayload;

    if (!payload.guid || !payload.username) {
      throw new Error('Invalid token payload');
    }

    if (!isUUID(payload.guid)) {
      throw new Error('Invalid token payload');
    }

    return payload;
  }
}

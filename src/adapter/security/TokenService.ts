import jwt, { SignOptions } from 'jsonwebtoken';
import { isUUID } from 'class-validator';
import { Service } from 'typedi';
import { User } from 'entity/User';
import { TokenPayload } from 'entity/TokenPayload';
import { TokenServiceInterface } from 'application/shared/port/TokenServiceInterface';

@Service()
export class TokenService implements TokenServiceInterface {
  generateToken(user: User): string {
    const payload: TokenPayload = {
      guid: user.guid,
      username: user.username,
    };
    
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    if (!jwtExpiresIn) {
      throw new Error('JWT_EXPIRES_IN environment variable is not set');
    }
    
    const options: SignOptions = {
      expiresIn: Number(jwtExpiresIn),
    };
    
    return jwt.sign(payload, jwtSecret, options);
  }

  verifyToken(token: string): TokenPayload {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    const payload = jwt.verify(token, jwtSecret) as TokenPayload;

    if (!payload.guid || !payload.username) {
      throw new Error('Invalid token payload');
    }

    if (!isUUID(payload.guid)) {
      throw new Error('Invalid token payload');
    }

    return payload;
  }
}

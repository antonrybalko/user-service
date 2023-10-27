import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserEntity } from '../persistence/entity/UserEntity';
import { TokenPayload } from '../api/shared/middleware/RequestInterface';

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 3;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  createToken(user: UserEntity): string {
    const payload: TokenPayload = {
      guid: user.guid,
      username: user.username,
    };
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN as string,
    });
  }
}

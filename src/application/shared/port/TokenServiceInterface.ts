import { TokenPayload } from 'entity/TokenPayload';
import { User } from 'entity/User';

export interface TokenServiceInterface {
  generateToken(user: User): string;
  verifyToken(token: string): TokenPayload;
}

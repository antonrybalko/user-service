import { TokenPayload } from 'domain/valueObject/TokenPayload';
import { User } from 'domain/entity/User';

export interface TokenServiceInterface {
  generateToken(user: User): string;
  verifyToken(token: string): TokenPayload;
}

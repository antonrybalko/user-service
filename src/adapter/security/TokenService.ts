import jwt, { SignOptions } from 'jsonwebtoken';
import { isUUID } from 'class-validator';
import { Service } from 'typedi';
import { User } from 'entity/User';
import { TokenPayload } from 'entity/TokenPayload';
import { TokenServiceInterface } from 'application/shared/port/TokenServiceInterface';
import crypto from 'crypto';

@Service()
export class TokenService implements TokenServiceInterface {
  // Access token expiration: 30 minutes (1800 seconds)
  private readonly ACCESS_TOKEN_EXPIRES_IN = 1800;
  // Refresh token expiration: 30 days (in seconds)
  private readonly REFRESH_TOKEN_EXPIRES_IN = 30 * 24 * 60 * 60;

  generateToken(user: User): string {
    const payload: TokenPayload = {
      guid: user.guid,
      username: user.username,
    };
    
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    const options: SignOptions = {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
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

  generateRefreshToken(userGuid: string): string {
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    
    if (!jwtRefreshSecret) {
      throw new Error('JWT_REFRESH_SECRET environment variable is not set');
    }

    if (!isUUID(userGuid)) {
      throw new Error('Invalid user GUID');
    }
    
    // Create a secure refresh token with userGuid and randomness
    const payload = {
      userGuid,
      // Add some randomness to make each token unique
      random: crypto.randomBytes(32).toString('hex')
    };
    
    const options: SignOptions = {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    };
    
    return jwt.sign(payload, jwtRefreshSecret, options);
  }

  verifyRefreshToken(token: string): { userGuid: string } {
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    
    if (!jwtRefreshSecret) {
      throw new Error('JWT_REFRESH_SECRET environment variable is not set');
    }
    
    try {
      const payload = jwt.verify(token, jwtRefreshSecret) as any;

      if (!payload.userGuid) {
        throw new Error('Invalid refresh token payload');
      }

      if (!isUUID(payload.userGuid)) {
        throw new Error('Invalid user GUID in refresh token');
      }

      return {
        userGuid: payload.userGuid
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  generateTokenPair(user: User): { 
    accessToken: string, 
    refreshToken: string
  } {
    // Generate access token
    const accessToken = this.generateToken(user);
    
    // Generate refresh token
    const refreshToken = this.generateRefreshToken(user.guid);
    
    return {
      accessToken,
      refreshToken
    };
  }
}

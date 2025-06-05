import jwt, { SignOptions } from 'jsonwebtoken';
import { isUUID } from 'class-validator';
import { Service } from 'typedi';
import { User } from 'entity/User';
import { TokenPayload } from 'entity/TokenPayload';
import {
  TokenServiceInterface,
  TokenResult,
  RefreshTokenResult,
  TokenPairResult,
} from 'application/shared/port/TokenServiceInterface';
import crypto from 'crypto';

@Service()
export class TokenService implements TokenServiceInterface {
  private readonly JWT_SECRET = process.env.JWT_SECRET;
  private readonly JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || 'refresh';
  private readonly ACCESS_TOKEN_EXPIRES_IN =
    Number(process.env.JWT_EXPIRES_IN) || 1800;
  private readonly REFRESH_TOKEN_EXPIRES_IN =
    Number(process.env.JWT_REFRESH_EXPIRES_IN) || 2592000;

  generateToken(user: User, expiresIn?: number): TokenResult {
    const actualExpiresIn = expiresIn ?? this.ACCESS_TOKEN_EXPIRES_IN;

    const payload: TokenPayload = {
      guid: user.guid,
      username: user.username,
    };

    if (!this.JWT_SECRET) {
      throw new Error('JWT secret is not set');
    }

    const options: SignOptions = {
      expiresIn: actualExpiresIn,
    };

    if (!options.expiresIn) {
      throw new Error('JWT expiration time is not set');
    }

    const token = jwt.sign(payload, this.JWT_SECRET, options);

    return {
      token,
      expiresIn: actualExpiresIn,
    };
  }

  verifyToken(token: string): TokenPayload {
    if (!this.JWT_SECRET) {
      throw new Error('JWT secret is not set');
    }

    const payload = jwt.verify(token, this.JWT_SECRET) as TokenPayload;

    if (!payload.guid || !payload.username) {
      throw new Error('Invalid token payload');
    }

    if (!isUUID(payload.guid)) {
      throw new Error('Invalid token payload');
    }

    return payload;
  }

  generateRefreshToken(
    userGuid: string,
    expiresIn?: number,
  ): RefreshTokenResult {
    const actualExpiresIn = expiresIn ?? this.REFRESH_TOKEN_EXPIRES_IN;

    if (!this.JWT_REFRESH_SECRET) {
      throw new Error('JWT refresh secret is not set');
    }

    if (!isUUID(userGuid)) {
      throw new Error('Invalid user GUID');
    }

    // Create a secure refresh token with userGuid and randomness
    const payload = {
      userGuid,
      // Add some randomness to make each token unique
      random: crypto.randomBytes(32).toString('hex'),
    };

    const options: SignOptions = {
      expiresIn: actualExpiresIn,
    };

    if (!options.expiresIn) {
      throw new Error('JWT refresh token expiration time is not set');
    }

    const refreshToken = jwt.sign(payload, this.JWT_REFRESH_SECRET, options);

    return {
      refreshToken,
      expiresIn: actualExpiresIn,
    };
  }

  verifyRefreshToken(token: string): { userGuid: string } {
    if (!this.JWT_REFRESH_SECRET) {
      throw new Error('JWT refresh secret is not set');
    }

    try {
      const payload = jwt.verify(token, this.JWT_REFRESH_SECRET) as any;

      if (!payload.userGuid) {
        throw new Error('Invalid refresh token payload');
      }

      if (!isUUID(payload.userGuid)) {
        throw new Error('Invalid user GUID in refresh token');
      }

      return {
        userGuid: payload.userGuid,
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

  generateTokenPair(
    user: User,
    tokenExpiresIn?: number,
    refreshTokenExpiresIn?: number,
  ): TokenPairResult {
    // Generate access token
    const accessTokenResult = this.generateToken(user, tokenExpiresIn);

    // Generate refresh token
    const refreshTokenResult = this.generateRefreshToken(
      user.guid,
      refreshTokenExpiresIn,
    );

    return {
      accessToken: accessTokenResult.token,
      accessTokenExpiresIn: accessTokenResult.expiresIn,
      refreshToken: refreshTokenResult.refreshToken,
      refreshTokenExpiresIn: refreshTokenResult.expiresIn,
    };
  }
}

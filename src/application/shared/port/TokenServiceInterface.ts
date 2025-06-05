import { TokenPayload } from 'entity/TokenPayload';
import { User } from 'entity/User';

/**
 * Token generation result containing the token and its expiration time
 */
export interface TokenResult {
  /** The generated token string */
  token: string;
  /** Expiration time in seconds from now */
  expiresIn: number;
}

/**
 * Refresh token generation result containing the token and its expiration time
 */
export interface RefreshTokenResult {
  /** The generated refresh token string */
  refreshToken: string;
  /** Expiration time in seconds from now */
  expiresIn: number;
}

/**
 * Token pair generation result containing both tokens and their expiration times
 */
export interface TokenPairResult {
  /** The generated access token string */
  accessToken: string;
  /** Access token expiration time in seconds from now */
  accessTokenExpiresIn: number;
  /** The generated refresh token string */
  refreshToken: string;
  /** Refresh token expiration time in seconds from now */
  refreshTokenExpiresIn: number;
}

/**
 * Interface for token-related operations
 */
export interface TokenServiceInterface {
  /**
   * Generate an access token for a user
   * @param user User to generate token for
   * @param expiresIn Optional expiration time in seconds
   * @returns Token and expiration information
   */
  generateToken(user: User, expiresIn?: number): TokenResult;

  /**
   * Verify an access token
   * @param token JWT token to verify
   * @returns Token payload if valid
   */
  verifyToken(token: string): TokenPayload;

  /**
   * Generate a refresh token for a user
   * @param userGuid User GUID to generate token for
   * @param expiresIn Optional expiration time in seconds
   * @returns Refresh token and expiration information
   */
  generateRefreshToken(
    userGuid: string,
    expiresIn?: number,
  ): RefreshTokenResult;

  /**
   * Verify a refresh token
   * @param token Refresh token to verify
   * @returns Object containing userGuid if valid
   */
  verifyRefreshToken(token: string): { userGuid: string };

  /**
   * Generate both access and refresh tokens
   * @param user User to generate tokens for
   * @param tokenExpiresIn Optional expiration time for access token in seconds
   * @param refreshTokenExpiresIn Optional expiration time for refresh token in seconds
   * @returns Object containing both tokens and their expiration times
   */
  generateTokenPair(
    user: User,
    tokenExpiresIn?: number,
    refreshTokenExpiresIn?: number,
  ): TokenPairResult;
}

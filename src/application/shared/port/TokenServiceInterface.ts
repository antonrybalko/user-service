import { TokenPayload } from 'entity/TokenPayload';
import { User } from 'entity/User';

/**
 * Interface for token-related operations
 */
export interface TokenServiceInterface {
  /**
   * Generate an access token for a user
   * @param user User to generate token for
   * @returns JWT access token
   */
  generateToken(user: User): string;
  
  /**
   * Verify an access token
   * @param token JWT token to verify
   * @returns Token payload if valid
   */
  verifyToken(token: string): TokenPayload;
  
  /**
   * Generate a refresh token for a user
   * @param userGuid User GUID to generate token for
   * @returns Refresh token string
   */
  generateRefreshToken(userGuid: string): string;
  
  /**
   * Verify a refresh token
   * @param token Refresh token to verify
   * @returns Object containing userGuid if valid
   */
  verifyRefreshToken(token: string): { userGuid: string };
  
  /**
   * Generate both access and refresh tokens
   * @param user User to generate tokens for
   * @returns Object containing both tokens
   */
  generateTokenPair(user: User): { 
    accessToken: string, 
    refreshToken: string
  };
}

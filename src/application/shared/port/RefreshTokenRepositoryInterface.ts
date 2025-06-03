import { RefreshToken } from 'entity/RefreshToken';

/**
 * Repository interface for refresh token operations
 */
export interface RefreshTokenRepositoryInterface {
  /**
   * Save a new refresh token
   * @param refreshToken The refresh token to save
   * @returns The saved refresh token
   */
  save(refreshToken: RefreshToken): Promise<RefreshToken>;

  /**
   * Find a refresh token by its token string
   * @param token The token string to search for
   * @returns The refresh token if found, null otherwise
   */
  findByToken(token: string): Promise<RefreshToken | null>;

  /**
   * Find all refresh tokens in a specific family
   * @param family The family identifier
   * @returns Array of refresh tokens in the family
   */
  findByFamily(family: string): Promise<RefreshToken[]>;

  /**
   * Find all refresh tokens for a specific user
   * @param userGuid The user's GUID
   * @returns Array of user's refresh tokens
   */
  findByUserGuid(userGuid: string): Promise<RefreshToken[]>;

  /**
   * Revoke a specific refresh token
   * @param tokenId The ID of the token to revoke
   */
  revokeToken(tokenId: string): Promise<void>;

  /**
   * Revoke all refresh tokens for a specific user
   * @param userGuid The user's GUID
   */
  revokeAllUserTokens(userGuid: string): Promise<void>;

  /**
   * Revoke all refresh tokens in a specific family
   * @param family The family identifier
   */
  revokeTokenFamily(family: string): Promise<void>;

  /**
   * Delete all expired refresh tokens
   */
  deleteExpiredTokens(): Promise<void>;
}

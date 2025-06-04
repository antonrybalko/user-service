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
   * Find all refresh tokens for a specific user
   * @param userGuid The user's GUID
   * @returns Array of user's refresh tokens
   */
  findByUserGuid(userGuid: string): Promise<RefreshToken[]>;

  /**
   * Delete a specific refresh token
   * @param token The token string to delete
   * @returns True if deleted, false if not found
   */
  deleteByToken(token: string): Promise<boolean>;

  /**
   * Delete all refresh tokens for a specific user
   * @param userGuid The user's GUID
   * @returns Number of tokens deleted
   */
  deleteByUserGuid(userGuid: string): Promise<number>;

  /**
   * Delete all expired refresh tokens
   */
  deleteExpiredTokens(): Promise<void>;
}

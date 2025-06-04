import { Service, Inject } from 'typedi';
import { TokenServiceInterface } from 'application/shared/port/TokenServiceInterface';
import { RefreshTokenRepositoryInterface } from 'application/shared/port/RefreshTokenRepositoryInterface';
import { UserRepositoryInterface } from 'application/user/port/UserRepositoryInterface';
import { TokenPair } from 'entity/TokenPair';
import { RefreshToken } from 'entity/RefreshToken';
import { v4 as uuidv4 } from 'uuid';
import { UnauthorizedException } from 'shared/exception/UnauthorizedException';
import { NotFoundException } from 'shared/exception/NotFoundException';
import { 
  TokenServiceInterfaceToken, 
  UserRepositoryInterfaceToken,
  RefreshTokenRepositoryInterfaceToken
} from 'di/tokens';

@Service()
export class TokenRotationService {
  @Inject(TokenServiceInterfaceToken)
  private tokenService!: TokenServiceInterface;

  @Inject(RefreshTokenRepositoryInterfaceToken)
  private refreshTokenRepository!: RefreshTokenRepositoryInterface;

  @Inject(UserRepositoryInterfaceToken)
  private userRepository!: UserRepositoryInterface;

  /**
   * Rotate tokens - verify refresh token, delete it, and generate new token pair
   * @param refreshTokenString The refresh token to rotate
   * @returns New token pair (access token + refresh token)
   */
  async rotateTokens(refreshTokenString: string): Promise<TokenPair> {
    try {
      // Verify the refresh token signature and expiration
      const { userGuid } = this.tokenService.verifyRefreshToken(refreshTokenString);
      
      // Check if token exists in database
      const refreshToken = await this.refreshTokenRepository.findByToken(refreshTokenString);
      
      if (!refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      if (!refreshToken.isValid()) {
        throw new UnauthorizedException('Refresh token expired');
      }
      
      // Find the user
      const user = await this.userRepository.findByGuid(userGuid);
      
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      if (!user.isActive()) {
        throw new UnauthorizedException('User is not active');
      }
      
      // Delete the current refresh token
      await this.refreshTokenRepository.deleteByToken(refreshTokenString);
      
      // Generate new token pair
      const tokenPair = this.tokenService.generateTokenPair(user);
      
      // Calculate expiration dates
      const now = new Date();
      const accessTokenExpiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes
      const refreshTokenExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      // Save new refresh token to database
      const newRefreshToken = new RefreshToken(
        uuidv4(),
        tokenPair.refreshToken,
        userGuid,
        refreshTokenExpiresAt,
        now
      );
      
      await this.refreshTokenRepository.save(newRefreshToken);
      
      // Return new token pair
      return new TokenPair(
        tokenPair.accessToken,
        tokenPair.refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt
      );
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error;
      }
      
      if (error instanceof Error && error.message.includes('expired')) {
        throw new UnauthorizedException('Refresh token expired');
      }
      
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Delete all refresh tokens for a user (for logout)
   * @param userGuid The user's GUID
   * @returns Number of tokens deleted
   */
  async revokeAllUserTokens(userGuid: string): Promise<number> {
    try {
      // Check if user exists
      const userExists = await this.userRepository.checkIfUserExists(userGuid);
      
      if (!userExists) {
        throw new NotFoundException('User not found');
      }
      
      // Delete all user's refresh tokens
      return await this.refreshTokenRepository.deleteByUserGuid(userGuid);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new Error(`Failed to delete user tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Remove expired tokens from database
   */
  async cleanupExpiredTokens(): Promise<void> {
    try {
      await this.refreshTokenRepository.deleteExpiredTokens();
    } catch (error) {
      throw new Error(`Failed to clean up expired tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

import { TokenPair } from 'entity/TokenPair';

/**
 * Data Transfer Object for token pair response
 * Contains both access and refresh tokens with their expiration dates
 */
export class TokenPairDto {
  /**
   * Creates a new TokenPairDto instance
   * @param accessToken JWT access token
   * @param refreshToken Refresh token
   * @param accessTokenExpiresAt When the access token expires
   * @param refreshTokenExpiresAt When the refresh token expires
   * @param tokenType The token type (default: "Bearer")
   */
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly accessTokenExpiresAt: Date,
    public readonly refreshTokenExpiresAt: Date,
    public readonly tokenType: string = 'Bearer'
  ) {}

  /**
   * Factory method to create a TokenPairDto from a TokenPair domain entity
   * @param tokenPair The token pair domain entity
   * @returns A new TokenPairDto instance
   */
  static fromTokenPair(tokenPair: TokenPair): TokenPairDto {
    return new TokenPairDto(
      tokenPair.accessToken,
      tokenPair.refreshToken,
      tokenPair.accessTokenExpiresAt,
      tokenPair.refreshTokenExpiresAt
    );
  }
}

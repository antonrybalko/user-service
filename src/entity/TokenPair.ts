/**
 * Entity representing a pair of access and refresh tokens
 */
export class TokenPair {
  /**
   * Creates a new TokenPair instance
   * @param accessToken JWT access token
   * @param refreshToken Refresh token
   * @param accessTokenExpiresAt When the access token expires
   * @param refreshTokenExpiresAt When the refresh token expires
   * @param family Token family identifier for tracking rotation
   */
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly accessTokenExpiresAt: Date,
    public readonly refreshTokenExpiresAt: Date,
    public readonly family: string,
  ) {}
}

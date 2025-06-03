/**
 * Domain entity representing a refresh token
 */
export class RefreshToken {
  /**
   * Creates a new RefreshToken instance
   * @param id Unique identifier for the refresh token (UUID)
   * @param token The actual refresh token string
   * @param userGuid Reference to the user this token belongs to
   * @param expiresAt When this token expires
   * @param createdAt When this token was created
   * @param isRevoked Whether this token has been revoked
   * @param family Token family identifier for tracking rotation
   */
  constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly userGuid: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public isRevoked: boolean = false,
    public readonly family: string,
  ) {}

  /**
   * Checks if the token is valid (not expired and not revoked)
   * @returns boolean indicating if the token is valid
   */
  isValid(): boolean {
    return !this.isExpired() && !this.isRevoked;
  }

  /**
   * Checks if the token is expired
   * @returns boolean indicating if the token is expired
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Revokes this token
   */
  revoke(): void {
    this.isRevoked = true;
  }
}

import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object for refresh token requests
 */
export class RefreshTokenDto {
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsString({ message: 'Refresh token must be a string' })
  public refreshToken: string;

  /**
   * Creates a new RefreshTokenDto instance from request body
   * @param body Request body containing refresh token
   */
  constructor(body: any) {
    this.refreshToken = body.refreshToken;
  }
}

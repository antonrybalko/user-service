import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import BaseController from 'presentation/web/controllers/shared/BaseController';
import { TokenRotationService } from 'application/tokenRotation/TokenRotationService';
import { TokenPairDto } from '../login/TokenPairDto';
import { UnauthorizedException } from 'shared/exception/UnauthorizedException';
import { RequestInterface } from 'presentation/web/middleware/RequestInterface';
import { RefreshTokenDto } from './RefreshTokenDto';

@Service()
export class RefreshTokenController extends BaseController {
  @Inject()
  private tokenRotationService: TokenRotationService;

  /**
   * Refresh tokens - validate refresh token and issue new token pair
   * @param request Express request with refresh token in body
   * @param response Express response
   * @returns New token pair or error response
   */
  public async refresh(request: Request, response: Response): Promise<Response> {
    try {
      const refreshTokenDto = new RefreshTokenDto(request.body);

      // Validate the request body
      await this.validate(refreshTokenDto);

      const tokenPair = await this.tokenRotationService.rotateTokens(refreshTokenDto.refreshToken);

      return response.status(200).json(TokenPairDto.fromTokenPair(tokenPair));
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return response.status(401).json({
          error: error.message || 'Invalid or expired refresh token',
        });
      }
      return this.handleError(response, error);
    }
  }

  /**
   * Logout user - revoke all refresh tokens
   * @param request Express request with authenticated user
   * @param response Express response
   * @returns Success response or error
   */
  public async logout(request: RequestInterface, response: Response): Promise<Response> {
    try {
      const { guid } = request.tokenPayload;

      if (!guid) {
        return response.status(401).json({
          error: 'Unauthorized',
        });
      }

      await this.tokenRotationService.revokeAllUserTokens(guid);

      return response.status(200).json({
        success: true,
        message: 'Successfully logged out',
      });
    } catch (error) {
      return this.handleError(response, error);
    }
  }
}

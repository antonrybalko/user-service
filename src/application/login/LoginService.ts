import { Service, Inject } from 'typedi';
import { UserAndPassword } from 'entity/UserAndPassword';
import { UnauthorizedException } from 'shared/exception/UnauthorizedException';
import { NotFoundException } from 'shared/exception/NotFoundException';
import { PasswordServiceInterface } from 'application/shared/port/PasswordServiceInterface';
import { TokenServiceInterface } from 'application/shared/port/TokenServiceInterface';
import { RefreshTokenRepositoryInterface } from 'application/shared/port/RefreshTokenRepositoryInterface';
import BaseUseCaseService from 'application/shared/BaseUseCaseService';
import { LoginRepositoryInterface } from './port/LoginRepositoryInterface';
import { LoginDto } from './dto/LoginDto';
import { TokenPair } from 'entity/TokenPair';
import { RefreshToken } from 'entity/RefreshToken';
import { v4 as uuidv4 } from 'uuid';
import {
  LoginRepositoryInterfaceToken,
  PasswordServiceInterfaceToken,
  TokenServiceInterfaceToken,
  RefreshTokenRepositoryInterfaceToken,
} from 'di/tokens';

@Service()
export class LoginService extends BaseUseCaseService {
  @Inject(LoginRepositoryInterfaceToken)
  private loginRepository!: LoginRepositoryInterface;

  @Inject(PasswordServiceInterfaceToken)
  private passwordService!: PasswordServiceInterface;

  @Inject(TokenServiceInterfaceToken)
  private tokenService!: TokenServiceInterface;

  @Inject(RefreshTokenRepositoryInterfaceToken)
  private refreshTokenRepository!: RefreshTokenRepositoryInterface;

  /**
   * Login user and return token pair (access token + refresh token)
   * @param loginData User name and password
   * @returns TokenPair containing access and refresh tokens with expiration dates
   */
  async login(loginData: LoginDto): Promise<TokenPair> {
    await this.validate(loginData);

    const { user, password: hashedPassword } =
      await this.findUserAndPassword(loginData);

    if (!user.isActive()) {
      throw new UnauthorizedException('User is not active');
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      loginData.password,
      hashedPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Generate token pair instead of single token
    const tokenPair = this.tokenService.generateTokenPair(user);

    // Calculate expiration dates
    const now = new Date();
    const accessTokenExpiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes
    const refreshTokenExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Create and save refresh token to database
    const refreshToken = new RefreshToken(
      uuidv4(),
      tokenPair.refreshToken,
      user.guid,
      refreshTokenExpiresAt,
      now,
      false,
      tokenPair.family
    );

    await this.refreshTokenRepository.save(refreshToken);

    // Return token pair with expiration dates
    return new TokenPair(
      tokenPair.accessToken,
      tokenPair.refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
      tokenPair.family
    );
  }

  private async findUserAndPassword(
    loginData: LoginDto,
  ): Promise<UserAndPassword> {
    try {
      return await this.loginRepository.findByUsername(loginData.username);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid username or password');
      }
      throw error;
    }
  }
}

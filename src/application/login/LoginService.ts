import { Service, Inject } from 'typedi';
import { UserAndPassword } from 'entity/UserAndPassword';
import { UnauthorizedException } from 'shared/exception/UnauthorizedException';
import { NotFoundException } from 'shared/exception/NotFoundException';
import { PasswordServiceInterface } from 'application/shared/port/PasswordServiceInterface';
import { TokenServiceInterface } from 'application/shared/port/TokenServiceInterface';
import BaseUseCaseService from 'application/shared/BaseUseCaseService';
import { LoginRepositoryInterface } from './port/LoginRepositoryInterface';
import { LoginDto } from './dto/LoginDto';
import {
  LoginRepositoryInterfaceToken,
  PasswordServiceInterfaceToken,
  TokenServiceInterfaceToken,
} from 'di/tokens';

@Service()
export class LoginService extends BaseUseCaseService {
  @Inject(LoginRepositoryInterfaceToken)
  private loginRepository!: LoginRepositoryInterface;

  @Inject(PasswordServiceInterfaceToken)
  private passwordService!: PasswordServiceInterface;

  @Inject(TokenServiceInterfaceToken)
  private tokenService!: TokenServiceInterface;

  /**
   * Login user and return JWT token
   * @param loginData User name and password
   * @returns JWT token
   */
  async login(loginData: LoginDto): Promise<string> {
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

    return this.tokenService.generateToken(user);
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

import { Service, Inject } from 'typedi';
import { LoginRepositoryInterface } from './LoginRepositoryInterface';
import { PasswordServiceInterface } from 'application/PasswordServiceInterface';
import { TokenServiceInterface } from 'application/TokenServiceInterface';
import { UnauthorizedException } from 'shared/exception/UnauthorizedException';
import UserAndPassword from 'entity/UserAndPassword';
import { NotFoundException } from 'shared/exception/NotFoundException';

type LoginData = {
  username: string;
  password: string;
};

@Service()
export class LoginService {
  @Inject('LoginRepositoryInterface')
  private loginRepository: LoginRepositoryInterface;

  @Inject('PasswordServiceInterface')
  private passwordService: PasswordServiceInterface;

  @Inject('TokenServiceInterface')
  private tokenService: TokenServiceInterface;

  /**
   * Login user and return JWT token
   * @param loginData User name and password
   * @returns JWT token
   */
  async login(loginData: LoginData): Promise<string> {
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
    loginData: LoginData,
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

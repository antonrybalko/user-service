import { Service, Inject } from 'typedi';
import { LoginRepositoryInterface } from './LoginRepositoryInterface';
import { PasswordServiceInterface } from 'application/PasswordServiceInterface';
import { TokenServiceInterface } from 'application/TokenServiceInterface';

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
      await this.loginRepository.findByUsername(loginData.username);
    if (!user.isActive()) {
      throw new Error('User is not active');
      // return res.status(401).json({
      //     error: 'Username is not active',
      // });
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      loginData.password,
      hashedPassword,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
      // return res.status(401).json({
      //     error: 'Invalid username or password',
      // });
    }
    console.log('!!! user', user);

    return this.tokenService.generateToken(user);
  }
}

import 'reflect-metadata';
import { Container } from 'typedi';
import { LoginService } from './LoginService';
import { LoginRepositoryInterface } from 'application/login/port/LoginRepositoryInterface';
import { PasswordServiceInterface } from 'application/shared/port/PasswordServiceInterface';
import { TokenServiceInterface } from 'application/shared/port/TokenServiceInterface';
import { ValidatorInterface } from 'shared/port/ValidatorInterface';
import { SanitizerInterface } from 'shared/port/SanitizerInterface';
import { LoginDto } from 'application/login/dto/LoginDto';
import { UnauthorizedException } from 'shared/exception/UnauthorizedException';
import { User } from 'entity/User';
import { UserAndPassword } from 'entity/UserAndPassword';
import { NotFoundException } from 'shared/exception/NotFoundException';
import { 
  LoginRepositoryInterfaceToken, 
  PasswordServiceInterfaceToken, 
  TokenServiceInterfaceToken, 
  ValidatorInterfaceToken, 
  SanitizerInterfaceToken 
} from 'di/tokens';

describe('LoginService', () => {
  let loginService: LoginService;
  let loginRepository: LoginRepositoryInterface;
  let passwordService: PasswordServiceInterface;
  let tokenService: TokenServiceInterface;
  let validator: ValidatorInterface;
  let sanitizer: SanitizerInterface;

  beforeAll(() => {
    loginRepository = {
      findByUsername: jest.fn(),
    } as unknown as LoginRepositoryInterface;

    passwordService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    } as unknown as PasswordServiceInterface;

    tokenService = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
    } as unknown as TokenServiceInterface;

    validator = {
      validate: jest.fn(),
    } as unknown as ValidatorInterface;

    sanitizer = {
      sanitize: jest.fn((dto) => dto),
    } as unknown as SanitizerInterface;

    Container.set(LoginRepositoryInterfaceToken, loginRepository);
    Container.set(PasswordServiceInterfaceToken, passwordService);
    Container.set(TokenServiceInterfaceToken, tokenService);
    Container.set(ValidatorInterfaceToken, validator);
    Container.set(SanitizerInterfaceToken, sanitizer);

    loginService = Container.get(LoginService);
  });

  afterAll(() => {
    Container.reset();
  });

  it('should return a token for valid credentials', async () => {
    const loginDto = new LoginDto({
      username: 'testuser',
      password: 'testpassword',
    });
    const user = new User('123', 'testuser', false, false, 'Test', 'User');
    const userAndPassword = new UserAndPassword(user, 'hashedpassword');

    (loginRepository.findByUsername as jest.Mock).mockResolvedValue(
      userAndPassword,
    );
    (passwordService.comparePassword as jest.Mock).mockResolvedValue(true);
    (tokenService.generateToken as jest.Mock).mockReturnValue('token');

    const token = await loginService.login(loginDto);

    expect(token).toBe('token');
    expect(loginRepository.findByUsername).toHaveBeenCalledWith('testuser');
    expect(passwordService.comparePassword).toHaveBeenCalledWith(
      'testpassword',
      'hashedpassword',
    );
    expect(tokenService.generateToken).toHaveBeenCalledWith(user);
  });

  it('should validate and sanitize login data', async () => {
    const loginDto = new LoginDto({
      username: 'testuser',
      password: 'testpassword',
    });
    const user = new User('123', 'testuser', false, false, 'Test', 'User');
    const userAndPassword = new UserAndPassword(user, 'hashedpassword');

    (loginRepository.findByUsername as jest.Mock).mockResolvedValue(
      userAndPassword,
    );
    (passwordService.comparePassword as jest.Mock).mockResolvedValue(true);
    (tokenService.generateToken as jest.Mock).mockReturnValue('token');

    await loginService.login(loginDto);

    expect(validator.validate).toHaveBeenCalledWith(loginDto);
    expect(sanitizer.sanitize).toHaveBeenCalledWith(loginDto);
  });

  it('should throw an error for invalid credentials', async () => {
    const loginDto = new LoginDto({
      username: 'invaliduser',
      password: 'invalidpassword',
    });

    (loginRepository.findByUsername as jest.Mock).mockRejectedValue(
      new UnauthorizedException('Invalid username or password'),
    );

    await expect(loginService.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw an error if user is not active', async () => {
    const loginDto = new LoginDto({
      username: 'inactiveuser',
      password: 'testpassword',
    });
    const inactiveUser = new User(
      '124',
      'inactiveuser',
      false,
      false,
      'Inactive',
      'User',
      'email',
      'phone',
      'oauth',
      'vk',
      'google',
      0,
    );
    const userAndPassword = new UserAndPassword(inactiveUser, 'hashedpassword');

    (loginRepository.findByUsername as jest.Mock).mockResolvedValue(
      userAndPassword,
    );
    (passwordService.comparePassword as jest.Mock).mockResolvedValue(true);

    await expect(loginService.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw an error if user is not found', async () => {
    const loginDto = new LoginDto({
      username: 'unknownuser',
      password: 'testpassword',
    });

    (loginRepository.findByUsername as jest.Mock).mockRejectedValue(
      new NotFoundException('User not found'),
    );

    await expect(loginService.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

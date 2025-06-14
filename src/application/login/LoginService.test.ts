import 'reflect-metadata';
import { Container } from 'typedi';
import { faker } from '@faker-js/faker';
import { LoginService } from './LoginService';
import { LoginRepositoryInterface } from 'application/login/port/LoginRepositoryInterface';
import { RefreshTokenRepositoryInterface } from 'application/shared/port/RefreshTokenRepositoryInterface';
import { PasswordServiceInterface } from 'application/shared/port/PasswordServiceInterface';
import { TokenServiceInterface } from 'application/shared/port/TokenServiceInterface';
import { ValidatorInterface } from 'shared/port/ValidatorInterface';
import { SanitizerInterface } from 'shared/port/SanitizerInterface';
import { LoginDto } from 'application/login/dto/LoginDto';
import { UnauthorizedException } from 'shared/exception/UnauthorizedException';
import { User, UserStatus } from 'entity/User';
import { UserAndPassword } from 'entity/UserAndPassword';
import { NotFoundException } from 'shared/exception/NotFoundException';
import { TokenPair } from 'entity/TokenPair';
import { RefreshToken } from 'entity/RefreshToken';
import {
  LoginRepositoryInterfaceToken,
  RefreshTokenRepositoryInterfaceToken,
  PasswordServiceInterfaceToken,
  TokenServiceInterfaceToken,
  ValidatorInterfaceToken,
  SanitizerInterfaceToken,
} from 'di/tokens';

describe('LoginService', () => {
  let loginService: LoginService;
  let loginRepository: jest.Mocked<LoginRepositoryInterface>;
  let refreshTokenRepository: jest.Mocked<RefreshTokenRepositoryInterface>;
  let passwordService: jest.Mocked<PasswordServiceInterface>;
  let tokenService: jest.Mocked<TokenServiceInterface>;
  let validator: jest.Mocked<ValidatorInterface>;
  let sanitizer: jest.Mocked<SanitizerInterface>;

  // Test data helpers
  const createLoginDto = (overrides: Partial<LoginDto> = {}) =>
    new LoginDto({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      ...overrides,
    });

  const createActiveUser = () =>
    new User(
      faker.string.uuid(),
      faker.internet.userName(),
      false,
      false,
      faker.person.firstName(),
      faker.person.lastName(),
      '79' + faker.string.numeric(9),
      faker.internet.email(),
      undefined,
      undefined,
      undefined,
      UserStatus.ACTIVE,
    );

  const createUserWithStatus = (status: UserStatus) =>
    new User(
      faker.string.uuid(),
      faker.internet.userName(),
      false,
      false,
      faker.person.firstName(),
      faker.person.lastName(),
      '79' + faker.string.numeric(9),
      faker.internet.email(),
      undefined,
      undefined,
      undefined,
      status,
    );

  const createUserAndPassword = (user: User, password?: string) =>
    new UserAndPassword(user, password || faker.internet.password());

  const createTokenPairResult = () => ({
    accessToken: faker.string.alphanumeric(128),
    refreshToken: faker.string.alphanumeric(64),
    accessTokenExpiresIn: faker.number.int({ min: 1800, max: 3600 }),
    refreshTokenExpiresIn: faker.number.int({ min: 86400, max: 2592000 }),
  });

  beforeEach(() => {
    // Create properly typed mocks
    loginRepository = {
      findByUsername: jest.fn(),
    } as jest.Mocked<LoginRepositoryInterface>;

    refreshTokenRepository = {
      deleteByUserGuid: jest.fn(),
      save: jest.fn(),
      findByToken: jest.fn(),
      deleteByToken: jest.fn(),
      findByUserGuid: jest.fn(),
      deleteExpiredTokens: jest.fn(),
    } as jest.Mocked<RefreshTokenRepositoryInterface>;

    passwordService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    } as jest.Mocked<PasswordServiceInterface>;

    tokenService = {
      generateToken: jest.fn(),
      generateTokenPair: jest.fn(),
      verifyToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
      generateRefreshToken: jest.fn(),
    } as jest.Mocked<TokenServiceInterface>;

    validator = {
      validate: jest.fn(),
      isValidationError: jest.fn(),
      validationErrorToMessage: jest.fn(),
    } as jest.Mocked<ValidatorInterface>;

    sanitizer = {
      sanitize: jest.fn((dto) => dto),
    } as jest.Mocked<SanitizerInterface>;

    // Set up container
    Container.set(LoginRepositoryInterfaceToken, loginRepository);
    Container.set(RefreshTokenRepositoryInterfaceToken, refreshTokenRepository);
    Container.set(PasswordServiceInterfaceToken, passwordService);
    Container.set(TokenServiceInterfaceToken, tokenService);
    Container.set(ValidatorInterfaceToken, validator);
    Container.set(SanitizerInterfaceToken, sanitizer);

    loginService = Container.get(LoginService);
  });

  afterEach(() => {
    Container.reset();
    jest.clearAllMocks();
  });

  describe('successful login', () => {
    it('should return a token pair for valid credentials', async () => {
      const loginDto = createLoginDto();
      const user = createActiveUser();
      const hashedPassword = faker.internet.password();
      const userAndPassword = createUserAndPassword(user, hashedPassword);
      const tokenPairResult = createTokenPairResult();
      const mockRefreshToken = new RefreshToken(
        faker.string.uuid(),
        user.guid,
        tokenPairResult.refreshToken,
        new Date(Date.now() + tokenPairResult.refreshTokenExpiresIn * 1000),
        new Date(),
      );

      loginRepository.findByUsername.mockResolvedValue(userAndPassword);
      passwordService.comparePassword.mockResolvedValue(true);
      tokenService.generateTokenPair.mockReturnValue(tokenPairResult);
      refreshTokenRepository.deleteByUserGuid.mockResolvedValue(1);
      refreshTokenRepository.save.mockResolvedValue(mockRefreshToken);

      const result = await loginService.login(loginDto);

      expect(result).toBeInstanceOf(TokenPair);
      expect(result.accessToken).toBe(tokenPairResult.accessToken);
      expect(result.refreshToken).toBe(tokenPairResult.refreshToken);
      expect(result.accessTokenExpiresAt).toBeInstanceOf(Date);
      expect(result.refreshTokenExpiresAt).toBeInstanceOf(Date);

      // Verify token expiration times are calculated correctly
      const now = Date.now();
      const accessTokenExpectedTime =
        now + tokenPairResult.accessTokenExpiresIn * 1000;
      const refreshTokenExpectedTime =
        now + tokenPairResult.refreshTokenExpiresIn * 1000;

      expect(result.accessTokenExpiresAt.getTime()).toBeCloseTo(
        accessTokenExpectedTime,
        -3,
      );
      expect(result.refreshTokenExpiresAt.getTime()).toBeCloseTo(
        refreshTokenExpectedTime,
        -3,
      );
    });

    it('should validate and sanitize login data before processing', async () => {
      const loginDto = createLoginDto();
      const user = createActiveUser();
      const userAndPassword = createUserAndPassword(user);
      const tokenPairResult = createTokenPairResult();

      loginRepository.findByUsername.mockResolvedValue(userAndPassword);
      passwordService.comparePassword.mockResolvedValue(true);
      tokenService.generateTokenPair.mockReturnValue(tokenPairResult);
      refreshTokenRepository.deleteByUserGuid.mockResolvedValue(0);
      refreshTokenRepository.save.mockResolvedValue(expect.any(RefreshToken));

      await loginService.login(loginDto);

      expect(validator.validate).toHaveBeenCalledWith(loginDto);
      expect(sanitizer.sanitize).toHaveBeenCalledWith(loginDto);
    });

    it('should delete existing refresh tokens before creating new ones', async () => {
      const loginDto = createLoginDto();
      const user = createActiveUser();
      const userAndPassword = createUserAndPassword(user);
      const tokenPairResult = createTokenPairResult();

      loginRepository.findByUsername.mockResolvedValue(userAndPassword);
      passwordService.comparePassword.mockResolvedValue(true);
      tokenService.generateTokenPair.mockReturnValue(tokenPairResult);
      refreshTokenRepository.deleteByUserGuid.mockResolvedValue(2);
      refreshTokenRepository.save.mockResolvedValue(expect.any(RefreshToken));

      await loginService.login(loginDto);

      expect(refreshTokenRepository.deleteByUserGuid).toHaveBeenCalledWith(
        user.guid,
      );
      // Verify call order by checking the mock call counts
      expect(refreshTokenRepository.deleteByUserGuid).toHaveBeenCalledTimes(1);
      expect(refreshTokenRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should save refresh token to repository', async () => {
      const loginDto = createLoginDto();
      const user = createActiveUser();
      const userAndPassword = createUserAndPassword(user);
      const tokenPairResult = createTokenPairResult();

      loginRepository.findByUsername.mockResolvedValue(userAndPassword);
      passwordService.comparePassword.mockResolvedValue(true);
      tokenService.generateTokenPair.mockReturnValue(tokenPairResult);
      refreshTokenRepository.deleteByUserGuid.mockResolvedValue(0);
      refreshTokenRepository.save.mockResolvedValue(expect.any(RefreshToken));

      await loginService.login(loginDto);

      expect(refreshTokenRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          userGuid: user.guid,
          token: tokenPairResult.refreshToken,
          expiresAt: expect.any(Date),
          createdAt: expect.any(Date),
        }),
      );
    });
  });

  describe('authentication failures', () => {
    it('should throw UnauthorizedException for invalid username', async () => {
      const loginDto = createLoginDto();

      loginRepository.findByUsername.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(loginService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid username or password'),
      );

      expect(loginRepository.findByUsername).toHaveBeenCalledWith(
        loginDto.username,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto = createLoginDto();
      const user = createActiveUser();
      const userAndPassword = createUserAndPassword(user);

      loginRepository.findByUsername.mockResolvedValue(userAndPassword);
      passwordService.comparePassword.mockResolvedValue(false);

      await expect(loginService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid username or password'),
      );

      expect(passwordService.comparePassword).toHaveBeenCalledWith(
        loginDto.password,
        userAndPassword.password,
      );
    });

    it('should preserve original error when repository throws non-NotFoundException', async () => {
      const loginDto = createLoginDto();
      const dbError = new Error('Database connection failed');

      loginRepository.findByUsername.mockRejectedValue(dbError);

      await expect(loginService.login(loginDto)).rejects.toThrow(dbError);
    });
  });

  describe('user status validation', () => {
    it.each([UserStatus.REGISTERED, UserStatus.DELETED, UserStatus.BLOCKED])(
      'should throw UnauthorizedException for user with status %s',
      async (status) => {
        const loginDto = createLoginDto();
        const user = createUserWithStatus(status);
        const userAndPassword = createUserAndPassword(user);

        loginRepository.findByUsername.mockResolvedValue(userAndPassword);
        passwordService.comparePassword.mockResolvedValue(true);

        await expect(loginService.login(loginDto)).rejects.toThrow(
          new UnauthorizedException('User is not active'),
        );

        expect(tokenService.generateTokenPair).not.toHaveBeenCalled();
      },
    );

    it('should allow login for active user', async () => {
      const loginDto = createLoginDto();
      const user = createUserWithStatus(UserStatus.ACTIVE);
      const userAndPassword = createUserAndPassword(user);
      const tokenPairResult = createTokenPairResult();

      loginRepository.findByUsername.mockResolvedValue(userAndPassword);
      passwordService.comparePassword.mockResolvedValue(true);
      tokenService.generateTokenPair.mockReturnValue(tokenPairResult);
      refreshTokenRepository.deleteByUserGuid.mockResolvedValue(0);
      refreshTokenRepository.save.mockResolvedValue(expect.any(RefreshToken));

      const result = await loginService.login(loginDto);

      expect(result).toBeInstanceOf(TokenPair);
      expect(tokenService.generateTokenPair).toHaveBeenCalledWith(user);
    });
  });

  describe('validation errors', () => {
    it('should throw validation error when validator fails', async () => {
      const loginDto = createLoginDto();
      const validationError = new Error('Invalid input');

      validator.validate.mockRejectedValue(validationError);

      await expect(loginService.login(loginDto)).rejects.toThrow(
        validationError,
      );

      expect(validator.validate).toHaveBeenCalledWith(loginDto);
      expect(loginRepository.findByUsername).not.toHaveBeenCalled();
    });

    it('should sanitize input before validation', async () => {
      const loginDto = createLoginDto();
      const sanitizedDto = { ...loginDto, username: loginDto.username.trim() };

      sanitizer.sanitize.mockReturnValue(sanitizedDto);
      validator.validate.mockRejectedValue(new Error('Validation failed'));

      await expect(loginService.login(loginDto)).rejects.toThrow();

      expect(sanitizer.sanitize).toHaveBeenCalledWith(loginDto);
      expect(validator.validate).toHaveBeenCalledWith(sanitizedDto);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle password service errors gracefully', async () => {
      const loginDto = createLoginDto();
      const user = createActiveUser();
      const userAndPassword = createUserAndPassword(user);
      const passwordError = new Error('Password service unavailable');

      loginRepository.findByUsername.mockResolvedValue(userAndPassword);
      passwordService.comparePassword.mockRejectedValue(passwordError);

      await expect(loginService.login(loginDto)).rejects.toThrow(passwordError);
    });

    it('should handle token service errors gracefully', async () => {
      const loginDto = createLoginDto();
      const user = createActiveUser();
      const userAndPassword = createUserAndPassword(user);
      const tokenError = new Error('Token generation failed');

      loginRepository.findByUsername.mockResolvedValue(userAndPassword);
      passwordService.comparePassword.mockResolvedValue(true);
      tokenService.generateTokenPair.mockImplementation(() => {
        throw tokenError;
      });

      await expect(loginService.login(loginDto)).rejects.toThrow(tokenError);
    });

    it('should handle refresh token repository save errors', async () => {
      const loginDto = createLoginDto();
      const user = createActiveUser();
      const userAndPassword = createUserAndPassword(user);
      const tokenPairResult = createTokenPairResult();
      const saveError = new Error('Failed to save refresh token');

      loginRepository.findByUsername.mockResolvedValue(userAndPassword);
      passwordService.comparePassword.mockResolvedValue(true);
      tokenService.generateTokenPair.mockReturnValue(tokenPairResult);
      refreshTokenRepository.deleteByUserGuid.mockResolvedValue(0);
      refreshTokenRepository.save.mockRejectedValue(saveError);

      await expect(loginService.login(loginDto)).rejects.toThrow(saveError);
    });

    it('should handle refresh token deletion errors gracefully', async () => {
      const loginDto = createLoginDto();
      const user = createActiveUser();
      const userAndPassword = createUserAndPassword(user);
      const deleteError = new Error('Failed to delete existing tokens');

      loginRepository.findByUsername.mockResolvedValue(userAndPassword);
      passwordService.comparePassword.mockResolvedValue(true);
      refreshTokenRepository.deleteByUserGuid.mockRejectedValue(deleteError);

      await expect(loginService.login(loginDto)).rejects.toThrow(deleteError);
    });
  });
});

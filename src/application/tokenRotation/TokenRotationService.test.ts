import 'reflect-metadata';
import { Container } from 'typedi';
import { faker } from '@faker-js/faker';
import { TokenRotationService } from './TokenRotationService';
import { TokenServiceInterface } from 'application/shared/port/TokenServiceInterface';
import { RefreshTokenRepositoryInterface } from 'application/shared/port/RefreshTokenRepositoryInterface';
import { UserRepositoryInterface } from 'application/user/port/UserRepositoryInterface';
import { RefreshToken } from 'entity/RefreshToken';
import { User, UserStatus } from 'entity/User';
import { UnauthorizedException } from 'shared/exception/UnauthorizedException';
import { NotFoundException } from 'shared/exception/NotFoundException';
import {
  TokenServiceInterfaceToken,
  RefreshTokenRepositoryInterfaceToken,
  UserRepositoryInterfaceToken,
} from 'di/tokens';

describe('TokenRotationService', () => {
  let tokenRotationService: TokenRotationService;
  let tokenService: jest.Mocked<TokenServiceInterface>;
  let refreshTokenRepository: jest.Mocked<RefreshTokenRepositoryInterface>;
  let userRepository: jest.Mocked<UserRepositoryInterface>;

  // Test data helpers
  const createValidRefreshToken = (userGuid: string) =>
    new RefreshToken(
      faker.string.uuid(),
      userGuid,
      faker.string.alphanumeric(64),
      faker.date.future(), // expires in the future
      faker.date.recent(),
    );

  const createExpiredRefreshToken = (userGuid: string) =>
    new RefreshToken(
      faker.string.uuid(),
      userGuid,
      faker.string.alphanumeric(64),
      faker.date.past(), // expired in the past
      faker.date.recent(),
    );

  const createActiveUser = (guid: string) =>
    new User(
      guid,
      faker.internet.userName(),
      false,
      false,
      faker.person.firstName(),
      faker.person.lastName(),
    );

  const createBlockedUser = (guid: string) =>
    new User(
      guid,
      faker.internet.userName(),
      false,
      false,
      faker.person.firstName(),
      faker.person.lastName(),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      UserStatus.BLOCKED,
    );

  const createTokenPair = () => ({
    accessToken: faker.string.alphanumeric(128),
    refreshToken: faker.string.alphanumeric(64),
    accessTokenExpiresIn: faker.number.int({ min: 3600, max: 7200 }),
    refreshTokenExpiresIn: faker.number.int({ min: 7200, max: 14400 }),
  });

  beforeEach(() => {
    tokenService = {
      verifyRefreshToken: jest.fn(),
      generateTokenPair: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
      generateRefreshToken: jest.fn(),
    } as jest.Mocked<TokenServiceInterface>;

    refreshTokenRepository = {
      findByToken: jest.fn(),
      deleteByToken: jest.fn(),
      save: jest.fn(),
      deleteByUserGuid: jest.fn(),
      findByUserGuid: jest.fn(),
      deleteExpiredTokens: jest.fn(),
    } as jest.Mocked<RefreshTokenRepositoryInterface>;

    userRepository = {
      findByGuid: jest.fn(),
      findAll: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      checkIfUserExists: jest.fn(),
    } as jest.Mocked<UserRepositoryInterface>;

    Container.set(TokenServiceInterfaceToken, tokenService);
    Container.set(RefreshTokenRepositoryInterfaceToken, refreshTokenRepository);
    Container.set(UserRepositoryInterfaceToken, userRepository);

    tokenRotationService = Container.get(TokenRotationService);
  });

  afterEach(() => {
    Container.reset();
    jest.clearAllMocks();
  });

  it('should rotate tokens when refresh token is valid', async () => {
    const userGuid = faker.string.uuid();
    const refreshTokenString = faker.string.alphanumeric(64);
    const existingToken = createValidRefreshToken(userGuid);
    const user = createActiveUser(userGuid);
    const tokenPairResult = createTokenPair();

    tokenService.verifyRefreshToken.mockReturnValue({ userGuid });
    refreshTokenRepository.findByToken.mockResolvedValue(existingToken);
    userRepository.findByGuid.mockResolvedValue(user);
    tokenService.generateTokenPair.mockReturnValue(tokenPairResult);
    refreshTokenRepository.deleteByToken.mockResolvedValue(true);
    refreshTokenRepository.save.mockResolvedValue(existingToken);

    const result = await tokenRotationService.rotateTokens(refreshTokenString);

    expect(result.accessToken).toBe(tokenPairResult.accessToken);
    expect(result.refreshToken).toBe(tokenPairResult.refreshToken);
    expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(
      refreshTokenString,
    );
    expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(
      refreshTokenString,
    );
    expect(refreshTokenRepository.deleteByToken).toHaveBeenCalledWith(
      refreshTokenString,
    );
    expect(tokenService.generateTokenPair).toHaveBeenCalledWith(user);
    expect(refreshTokenRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userGuid,
        token: tokenPairResult.refreshToken,
      }),
    );
  });

  it('should throw UnauthorizedException if refresh token not found', async () => {
    const userGuid = faker.string.uuid();
    const refreshTokenString = faker.string.alphanumeric(64);

    tokenService.verifyRefreshToken.mockReturnValue({ userGuid });
    refreshTokenRepository.findByToken.mockResolvedValue(null);

    await expect(
      tokenRotationService.rotateTokens(refreshTokenString),
    ).rejects.toThrow(UnauthorizedException);

    expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(
      refreshTokenString,
    );
    expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(
      refreshTokenString,
    );
  });

  it('should throw UnauthorizedException if refresh token expired', async () => {
    const userGuid = faker.string.uuid();
    const refreshTokenString = faker.string.alphanumeric(64);
    const expiredToken = createExpiredRefreshToken(userGuid);

    tokenService.verifyRefreshToken.mockReturnValue({ userGuid });
    refreshTokenRepository.findByToken.mockResolvedValue(expiredToken);

    await expect(
      tokenRotationService.rotateTokens(refreshTokenString),
    ).rejects.toThrow(UnauthorizedException);

    expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(
      refreshTokenString,
    );
    expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(
      refreshTokenString,
    );
  });

  it('should throw NotFoundException if user not found', async () => {
    const userGuid = faker.string.uuid();
    const refreshTokenString = faker.string.alphanumeric(64);
    const validToken = createValidRefreshToken(userGuid);

    tokenService.verifyRefreshToken.mockReturnValue({ userGuid });
    refreshTokenRepository.findByToken.mockResolvedValue(validToken);
    userRepository.findByGuid.mockRejectedValue(
      new NotFoundException(faker.lorem.sentence()),
    );

    await expect(
      tokenRotationService.rotateTokens(refreshTokenString),
    ).rejects.toThrow(NotFoundException);

    expect(userRepository.findByGuid).toHaveBeenCalledWith(userGuid);
  });

  it('should throw UnauthorizedException if user is blocked', async () => {
    const userGuid = faker.string.uuid();
    const refreshTokenString = faker.string.alphanumeric(64);
    const validToken = createValidRefreshToken(userGuid);
    const blockedUser = createBlockedUser(userGuid);

    tokenService.verifyRefreshToken.mockReturnValue({ userGuid });
    refreshTokenRepository.findByToken.mockResolvedValue(validToken);
    userRepository.findByGuid.mockResolvedValue(blockedUser);

    await expect(
      tokenRotationService.rotateTokens(refreshTokenString),
    ).rejects.toThrow(UnauthorizedException);

    expect(userRepository.findByGuid).toHaveBeenCalledWith(userGuid);
  });

  it('should throw UnauthorizedException when verifyRefreshToken reports expired', async () => {
    const refreshTokenString = faker.string.alphanumeric(64);

    tokenService.verifyRefreshToken.mockImplementation(() => {
      throw new Error('expired');
    });

    await expect(
      tokenRotationService.rotateTokens(refreshTokenString),
    ).rejects.toThrow('Refresh token expired');

    expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(
      refreshTokenString,
    );
  });

  it('should throw UnauthorizedException for unexpected errors', async () => {
    const refreshTokenString = faker.string.alphanumeric(64);

    tokenService.verifyRefreshToken.mockImplementation(() => {
      throw new Error('boom');
    });

    await expect(
      tokenRotationService.rotateTokens(refreshTokenString),
    ).rejects.toThrow('Invalid refresh token');

    expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(
      refreshTokenString,
    );
  });

  describe('revokeAllUserTokens', () => {
    it('should revoke all tokens for an existing user', async () => {
      const userGuid = faker.string.uuid();
      const deletedTokensCount = faker.number.int({ min: 1, max: 5 });

      userRepository.checkIfUserExists.mockResolvedValue(true);
      refreshTokenRepository.deleteByUserGuid.mockResolvedValue(
        deletedTokensCount,
      );

      const result = await tokenRotationService.revokeAllUserTokens(userGuid);

      expect(result).toBe(deletedTokensCount);
      expect(userRepository.checkIfUserExists).toHaveBeenCalledWith(userGuid);
      expect(refreshTokenRepository.deleteByUserGuid).toHaveBeenCalledWith(
        userGuid,
      );
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const userGuid = faker.string.uuid();

      userRepository.checkIfUserExists.mockResolvedValue(false);

      await expect(
        tokenRotationService.revokeAllUserTokens(userGuid),
      ).rejects.toThrow(NotFoundException);

      expect(userRepository.checkIfUserExists).toHaveBeenCalledWith(userGuid);
      expect(refreshTokenRepository.deleteByUserGuid).not.toHaveBeenCalled();
    });

    it('should wrap database errors with descriptive message', async () => {
      const userGuid = faker.string.uuid();
      const dbError = new Error(faker.lorem.sentence());

      userRepository.checkIfUserExists.mockResolvedValue(true);
      refreshTokenRepository.deleteByUserGuid.mockRejectedValue(dbError);

      await expect(
        tokenRotationService.revokeAllUserTokens(userGuid),
      ).rejects.toThrow(`Failed to delete user tokens: ${dbError.message}`);

      expect(refreshTokenRepository.deleteByUserGuid).toHaveBeenCalledWith(
        userGuid,
      );
    });
  });
});

import 'reflect-metadata';
import { Container } from 'typedi';
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
  let tokenService: TokenServiceInterface;
  let refreshTokenRepository: RefreshTokenRepositoryInterface;
  let userRepository: UserRepositoryInterface;

  beforeAll(() => {
    tokenService = {
      verifyRefreshToken: jest.fn(),
      generateTokenPair: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
      generateRefreshToken: jest.fn(),
    } as unknown as TokenServiceInterface;

    refreshTokenRepository = {
      findByToken: jest.fn(),
      deleteByToken: jest.fn(),
      save: jest.fn(),
      deleteByUserGuid: jest.fn(),
      findByUserGuid: jest.fn(),
      deleteExpiredTokens: jest.fn(),
    } as unknown as RefreshTokenRepositoryInterface;

    userRepository = {
      findByGuid: jest.fn(),
      findAll: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      checkIfUserExists: jest.fn(),
    } as unknown as UserRepositoryInterface;

    Container.set(TokenServiceInterfaceToken, tokenService);
    Container.set(RefreshTokenRepositoryInterfaceToken, refreshTokenRepository);
    Container.set(UserRepositoryInterfaceToken, userRepository);

    tokenRotationService = Container.get(TokenRotationService);
  });

  afterAll(() => {
    Container.reset();
  });

  it('should rotate tokens when refresh token is valid', async () => {
    const userGuid = 'user-guid';
    const refreshTokenString = 'valid-refresh-token';
    const existingToken = new RefreshToken(
      'id',
      userGuid,
      refreshTokenString,
      new Date(Date.now() + 10000),
      new Date(),
    );
    const user = new User(userGuid, 'username', false, false, 'Test');
    const tokenPairResult = {
      accessToken: 'access',
      refreshToken: 'refresh',
      accessTokenExpiresIn: 3600,
      refreshTokenExpiresIn: 7200,
    };

    (tokenService.verifyRefreshToken as jest.Mock).mockReturnValue({
      userGuid,
    });
    (refreshTokenRepository.findByToken as jest.Mock).mockResolvedValue(
      existingToken,
    );
    (userRepository.findByGuid as jest.Mock).mockResolvedValue(user);
    (tokenService.generateTokenPair as jest.Mock).mockReturnValue(
      tokenPairResult,
    );
    (refreshTokenRepository.deleteByToken as jest.Mock).mockResolvedValue(true);
    (refreshTokenRepository.save as jest.Mock).mockResolvedValue(existingToken);

    const pair = await tokenRotationService.rotateTokens(refreshTokenString);

    expect(pair.accessToken).toBe('access');
    expect(pair.refreshToken).toBe('refresh');
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
    expect(refreshTokenRepository.save).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if refresh token not found', async () => {
    (tokenService.verifyRefreshToken as jest.Mock).mockReturnValue({
      userGuid: 'uid',
    });
    (refreshTokenRepository.findByToken as jest.Mock).mockResolvedValue(null);

    await expect(tokenRotationService.rotateTokens('missing')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if refresh token expired', async () => {
    const expired = new RefreshToken(
      'id',
      'uid',
      'token',
      new Date(Date.now() - 1000),
      new Date(),
    );
    (tokenService.verifyRefreshToken as jest.Mock).mockReturnValue({
      userGuid: 'uid',
    });
    (refreshTokenRepository.findByToken as jest.Mock).mockResolvedValue(
      expired,
    );

    await expect(tokenRotationService.rotateTokens('token')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw NotFoundException if user not found', async () => {
    const valid = new RefreshToken(
      'id',
      'uid',
      'token',
      new Date(Date.now() + 1000),
      new Date(),
    );
    (tokenService.verifyRefreshToken as jest.Mock).mockReturnValue({
      userGuid: 'uid',
    });
    (refreshTokenRepository.findByToken as jest.Mock).mockResolvedValue(valid);
    (userRepository.findByGuid as jest.Mock).mockResolvedValue(undefined);

    await expect(tokenRotationService.rotateTokens('token')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw UnauthorizedException if user is inactive', async () => {
    const valid = new RefreshToken(
      'id',
      'uid',
      'token',
      new Date(Date.now() + 1000),
      new Date(),
    );
    const inactiveUser = new User(
      'uid',
      'username',
      false,
      false,
      'Test',
      'User',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      UserStatus.BLOCKED,
    );

    (tokenService.verifyRefreshToken as jest.Mock).mockReturnValue({
      userGuid: 'uid',
    });
    (refreshTokenRepository.findByToken as jest.Mock).mockResolvedValue(valid);
    (userRepository.findByGuid as jest.Mock).mockResolvedValue(inactiveUser);

    await expect(tokenRotationService.rotateTokens('token')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when verifyRefreshToken reports expired', async () => {
    (tokenService.verifyRefreshToken as jest.Mock).mockImplementation(() => {
      throw new Error('expired');
    });

    await expect(tokenRotationService.rotateTokens('bad')).rejects.toThrow(
      'Refresh token expired',
    );
  });

  it('should throw UnauthorizedException for unexpected errors', async () => {
    (tokenService.verifyRefreshToken as jest.Mock).mockImplementation(() => {
      throw new Error('boom');
    });

    await expect(tokenRotationService.rotateTokens('bad')).rejects.toThrow(
      'Invalid refresh token',
    );
  });

  it('should revoke all tokens for a user', async () => {
    (userRepository.checkIfUserExists as jest.Mock).mockResolvedValue(true);
    (refreshTokenRepository.deleteByUserGuid as jest.Mock).mockResolvedValue(2);

    await expect(tokenRotationService.revokeAllUserTokens('uid')).resolves.toBe(
      2,
    );
  });

  it('should throw NotFoundException when revoking tokens for missing user', async () => {
    (userRepository.checkIfUserExists as jest.Mock).mockResolvedValue(false);

    await expect(
      tokenRotationService.revokeAllUserTokens('uid'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should wrap unexpected errors when revoking tokens', async () => {
    (userRepository.checkIfUserExists as jest.Mock).mockResolvedValue(true);
    (refreshTokenRepository.deleteByUserGuid as jest.Mock).mockRejectedValue(
      new Error('db'),
    );

    await expect(
      tokenRotationService.revokeAllUserTokens('uid'),
    ).rejects.toThrow('Failed to delete user tokens: db');
  });
});

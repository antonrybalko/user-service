import { Repository, LessThan } from 'typeorm';
import { Service } from 'typedi';
import { RefreshToken } from 'entity/RefreshToken';
import { RefreshTokenEntity } from '../entity/RefreshTokenEntity';
import { RefreshTokenRepositoryInterface } from 'application/shared/port/RefreshTokenRepositoryInterface';
import { AppDataSource } from '../data-source';

@Service()
export class RefreshTokenRepository implements RefreshTokenRepositoryInterface {
  private refreshTokenRepository: Repository<RefreshTokenEntity>;

  constructor() {
    this.refreshTokenRepository = AppDataSource.getRepository(RefreshTokenEntity);
  }

  async save(refreshToken: RefreshToken): Promise<RefreshToken> {
    const refreshTokenEntity = new RefreshTokenEntity();
    refreshTokenEntity.id = refreshToken.id;
    refreshTokenEntity.token = refreshToken.token;
    refreshTokenEntity.userGuid = refreshToken.userGuid;
    refreshTokenEntity.expiresAt = refreshToken.expiresAt;
    refreshTokenEntity.isRevoked = refreshToken.isRevoked;
    refreshTokenEntity.family = refreshToken.family;

    const savedEntity = await this.refreshTokenRepository.save(refreshTokenEntity);
    return savedEntity.toDomainEntity();
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshTokenEntity = await this.refreshTokenRepository.findOne({
      where: { token }
    });

    return refreshTokenEntity ? refreshTokenEntity.toDomainEntity() : null;
  }

  async findByFamily(family: string): Promise<RefreshToken[]> {
    const refreshTokenEntities = await this.refreshTokenRepository.find({
      where: { family }
    });

    return refreshTokenEntities.map(entity => entity.toDomainEntity());
  }

  async findByUserGuid(userGuid: string): Promise<RefreshToken[]> {
    const refreshTokenEntities = await this.refreshTokenRepository.find({
      where: { userGuid }
    });

    return refreshTokenEntities.map(entity => entity.toDomainEntity());
  }

  async revokeToken(tokenId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { id: tokenId },
      { isRevoked: true }
    );
  }

  async revokeAllUserTokens(userGuid: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { userGuid },
      { isRevoked: true }
    );
  }

  async revokeTokenFamily(family: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { family },
      { isRevoked: true }
    );
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.refreshTokenRepository.delete({
      expiresAt: LessThan(new Date())
    });
  }
}

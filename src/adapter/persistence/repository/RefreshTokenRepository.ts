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
    this.refreshTokenRepository =
      AppDataSource.getRepository(RefreshTokenEntity);
  }

  async save(refreshToken: RefreshToken): Promise<RefreshToken> {
    const refreshTokenEntity = new RefreshTokenEntity();
    refreshTokenEntity.id = refreshToken.id;
    refreshTokenEntity.token = refreshToken.token;
    refreshTokenEntity.userGuid = refreshToken.userGuid;
    refreshTokenEntity.expiresAt = refreshToken.expiresAt;

    const savedEntity =
      await this.refreshTokenRepository.save(refreshTokenEntity);
    return savedEntity.toDomainEntity();
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshTokenEntity = await this.refreshTokenRepository.findOne({
      where: { token },
    });

    return refreshTokenEntity ? refreshTokenEntity.toDomainEntity() : null;
  }

  async findByUserGuid(userGuid: string): Promise<RefreshToken[]> {
    const refreshTokenEntities = await this.refreshTokenRepository.find({
      where: { userGuid },
    });

    return refreshTokenEntities.map((entity) => entity.toDomainEntity());
  }

  async deleteByToken(token: string): Promise<boolean> {
    const result = await this.refreshTokenRepository.delete({ token });
    return (
      result.affected !== null &&
      result.affected !== undefined &&
      result.affected > 0
    );
  }

  async deleteByUserGuid(userGuid: string): Promise<number> {
    const result = await this.refreshTokenRepository.delete({ userGuid });
    return result.affected !== null && result.affected !== undefined
      ? result.affected
      : 0;
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.refreshTokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}

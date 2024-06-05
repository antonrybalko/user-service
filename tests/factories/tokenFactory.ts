import { AppDataSource } from 'infrastructure/persistence/data-source';
import { UserEntity } from 'infrastructure/persistence/entity/UserEntity';
import { TokenService } from 'infrastructure/security/TokenService';
import { createUser } from './userFactory';

export const createUserAndToken = async (
  overrides: Partial<UserEntity> = {},
) => {
  const user = await createUser(overrides);
  await AppDataSource.manager.save(user);

  const tokenService = new TokenService();
  const token = tokenService.generateToken(user.toDomainEntity());

  return { user, token };
};

import { AppDataSource } from 'adapter/persistence/data-source';
import { UserEntity } from 'adapter/persistence/entity/UserEntity';
import { TokenService } from 'adapter/security/TokenService';
import { createUser } from './userFactory';

export const createUserAndToken = async (
  overrides: Partial<UserEntity> = {},
) => {
  const user = await createUser(overrides);
  await AppDataSource.manager.save(user);

  const tokenService = new TokenService();
  const { token } = tokenService.generateToken(user.toDomainEntity());

  return { user, token };
};

import { AppDataSource } from '../persistence/data-source';
import { NotFoundException } from './exception/NotFoundException';
import User from '../entity/User';
import { UserEntity } from '../persistence/entity/UserEntity';

export class UserService {
  async findByUsername(username: string): Promise<UserEntity> {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByGuid(guid: string): Promise<User> {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const user = await userRepository.findOne({ where: { guid } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.toDomainEntity();
  }
}

import { AppDataSource } from '../persistence/data-source';
import { NotFoundException } from '../shared/exception/NotFoundException';
import User, { UserStatus } from '../entity/User';
import { UserEntity } from '../persistence/entity/UserEntity';

export class UserService {
  async isUserAdmin(userGuid: string): Promise<boolean> {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const user = await userRepository.findOne({ where: { guid: userGuid } });
    return (
      user !== null &&
      user.status === UserStatus.ACTIVE &&
      user.isAdmin === true
    );
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

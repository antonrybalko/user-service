import { Repository } from 'typeorm';
import { UserEntity } from '../entity/UserEntity';
import { AppDataSource } from '../data-source';
import { Service } from 'typedi';

@Service()
export abstract class BaseUserRepository {
  protected userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
  }

  protected async findUserByGuid(guid: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { guid } });
  }

  protected async findUserByUsername(
    username: string,
  ): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }
}

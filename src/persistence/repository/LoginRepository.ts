import { LoginRepositoryInterface } from 'application/login/LoginRepositoryInterface';
import UserAndPassword from 'entity/UserAndPassword';
import { AppDataSource } from 'persistence/data-source';
import { UserEntity } from 'persistence/entity/UserEntity';
import { NotFoundException } from 'shared/exception/NotFoundException';
import { Service } from 'typedi';
import { Repository } from 'typeorm';

@Service()
export class LoginRepository implements LoginRepositoryInterface {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
  }

  async findByUsername(username: string): Promise<UserAndPassword> {
    const user = await this.userRepository.findOne({
      where: [{ username }],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new UserAndPassword(user.toDomainEntity(), user.password);
  }
}

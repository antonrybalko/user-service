import { LoginRepositoryInterface } from '../../../application/usecase/login/LoginRepositoryInterface';
import UserAndPassword from '../../../domain/valueObject/UserAndPassword';
import { AppDataSource } from '../data-source';
import { UserEntity } from '../entity/UserEntity';
import { NotFoundException } from '../../../shared/exception/NotFoundException';
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

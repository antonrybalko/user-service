import { LoginRepositoryInterface } from 'application/usecase/login/LoginRepositoryInterface';
import { UserAndPassword } from 'domain/valueObject/UserAndPassword';
import { NotFoundException } from 'shared/exception/NotFoundException';
import { Service } from 'typedi';
import { BaseUserRepository } from './BaseUserRepository';

@Service()
export class LoginRepository
  extends BaseUserRepository
  implements LoginRepositoryInterface
{
  async findByUsername(username: string): Promise<UserAndPassword> {
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new UserAndPassword(user.toDomainEntity(), user.password);
  }
}

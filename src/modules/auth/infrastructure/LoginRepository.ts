import { LoginRepositoryInterface } from '../application/login_usecases/LoginRepositoryInterface';
import { UserAndPassword } from 'modules/auth/domain/UserAndPassword';
import { NotFoundException } from 'shared/exception/NotFoundException';
import { Service } from 'typedi';
import { BaseUserRepository } from 'modules/user/infrastructure/BaseUserRepository';

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

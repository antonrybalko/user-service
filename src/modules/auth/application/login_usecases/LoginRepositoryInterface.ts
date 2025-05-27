import { UserAndPassword } from 'modules/auth/domain/UserAndPassword';

export interface LoginRepositoryInterface {
  findByUsername(username: string): Promise<UserAndPassword>;
}

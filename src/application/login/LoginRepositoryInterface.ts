import UserAndPassword from 'entity/UserAndPassword';

export interface LoginRepositoryInterface {
  findByUsername(username: string): Promise<UserAndPassword>;
}

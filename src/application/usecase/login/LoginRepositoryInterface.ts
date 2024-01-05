import UserAndPassword from 'domain/valueObject/UserAndPassword';

export interface LoginRepositoryInterface {
  findByUsername(username: string): Promise<UserAndPassword>;
}

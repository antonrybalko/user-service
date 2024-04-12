import { User } from 'domain/entity/User';

export class UserAndPassword {
  constructor(
    public user: User,
    public password: string,
  ) {}
}

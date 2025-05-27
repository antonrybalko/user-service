import { User } from 'entity/User';

export class UserAndPassword {
  constructor(
    public user: User,
    public password: string,
  ) {}
}

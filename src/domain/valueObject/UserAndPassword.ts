import User from 'domain/entity/User';

export default class UserAndPassword {
  constructor(
    public user: User,
    public password: string,
  ) {}
}

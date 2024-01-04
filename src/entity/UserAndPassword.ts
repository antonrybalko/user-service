import User from './User';

export default class UserAndPassword {
  constructor(
    public user: User,
    public password: string,
  ) {}
}

import { PasswordServiceInterface } from '../../application/services/PasswordServiceInterface';
import bcrypt from 'bcrypt';
import { Service } from 'typedi';

@Service()
export class PasswordService implements PasswordServiceInterface {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 3;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User, UserStatus } from '../entity/User';
import { AuthService } from '../service/AuthService';
import { RegisterDto } from './RegisterDto';

export class RegistrationRepository {
  private authService: AuthService;
  private userRepository: Repository<User>;

  constructor() {
    this.authService = new AuthService();
    this.userRepository = AppDataSource.getRepository(User);
  }

  async checkIfUserExists({ username }: RegisterDto): Promise<boolean> {
    // Check for existing user
    const usernameExists = await this.userRepository.findOne({
      where: [{ username }],
    });
    return !!usernameExists;
  }

  async checkIfEmailOrPhoneExists({
    email,
    phoneNumber,
  }: RegisterDto): Promise<boolean> {
    // Check for existing user
    const emailOrPhoneExists = await this.userRepository.findOne({
      where: [{ email }, { phoneNumber }],
    });
    return !!emailOrPhoneExists;
  }

  async createUser(userData: RegisterDto): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    // Hash the password
    const hashedPassword = await this.authService.hashPassword(
      userData.password,
    );

    // Create and save the user
    const user = new User();
    user.username = userData.username;
    user.password = hashedPassword;
    user.email = userData.email;
    user.phoneNumber = userData.phoneNumber;
    user.isVendor = userData.isVendor;
    user.status = UserStatus.ACTIVE;

    return await userRepository.save(user);
  }
}

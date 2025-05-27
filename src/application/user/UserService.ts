import { Service, Inject } from 'typedi';
import { User, UserStatus } from 'entity/User';
import { NotFoundException } from 'shared/exception/NotFoundException';
import { UserRepositoryInterface } from './port/UserRepositoryInterface';
import BaseUseCaseService from 'application/shared/BaseUseCaseService';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { UserRepositoryInterfaceToken } from 'di/tokens';

@Service()
export class UserService extends BaseUseCaseService {
  @Inject(UserRepositoryInterfaceToken)
  private manageUsersRepository!: UserRepositoryInterface;

  /**
   * Get all users
   * @returns Array of users
   */
  async getAllUsers(): Promise<User[]> {
    return await this.manageUsersRepository.findAll();
  }

  /**
   * Get a user by GUID
   * @param guid User's global unique identifier
   * @returns User object
   */
  async getUserByGuid(guid: string): Promise<User> {
    if (!(await this.manageUsersRepository.checkIfUserExists(guid))) {
      throw new NotFoundException(`User with GUID ${guid} does not exist`);
    }
    return await this.manageUsersRepository.findByGuid(guid);
  }

  /**
   * Update a user
   * @param guid User's global unique identifier
   * @param userData Data to update the user with
   * @returns Updated user object
   */
  async updateUser(guid: string, userData: UpdateUserDto): Promise<User> {
    await this.validate(userData);
    if (!(await this.manageUsersRepository.checkIfUserExists(guid))) {
      throw new NotFoundException(`User with GUID ${guid} does not exist`);
    }
    return await this.manageUsersRepository.updateUser(
      guid,
      userData.username,
      userData.email,
      userData.phone,
      userData.firstname,
      userData.lastname,
      userData.isAdmin,
      userData.isVendor,
      userData.status,
    );
  }

  /**
   * Delete a user
   * @param guid User's global unique identifier
   */
  async deleteUser(guid: string): Promise<boolean> {
    if (!(await this.manageUsersRepository.checkIfUserExists(guid))) {
      throw new NotFoundException(`User with GUID ${guid} does not exist`);
    }
    return await this.manageUsersRepository.deleteUser(guid);
  }

  async isUserAdmin(guid: string): Promise<boolean> {
    if (!(await this.manageUsersRepository.checkIfUserExists(guid))) {
      return false;
    }
    const user = await this.manageUsersRepository.findByGuid(guid);
    return user !== null && user.status === UserStatus.ACTIVE && user.isAdmin;
  }
}

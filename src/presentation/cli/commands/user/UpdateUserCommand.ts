import { Command } from 'commander';
import { Service, Inject } from 'typedi';
import { UserService } from 'application/user/UserService';
import { UpdateUserDto } from 'application/user/dto/UpdateUserDto';
import BaseCommand from '../BaseCommand';

@Service()
export default class UpdateUserCommand extends BaseCommand {
  @Inject()
  private manageUsersService: UserService;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(
    program: Command,
    guid: string,
    options: UpdateUserDto,
  ): Promise<void> {
    try {
      const updateUserDto = new UpdateUserDto(options);
      const updatedUser = await this.manageUsersService.updateUser(
        guid,
        updateUserDto,
      );
      // eslint-disable-next-line no-console
      console.log('Updated User:', updatedUser);
    } catch (error) {
      this.handleError(program, error);
    }
  }
}

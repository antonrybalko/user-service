import { Command } from 'commander';
import { Service, Container } from 'typedi';
import { ManageUsersService } from 'application/usecase/manageUsers/ManageUsersService';
import { UpdateUserDto } from 'application/usecase/manageUsers/UpdateUserDto';
import BaseCommand from './BaseCommand';

@Service()
export class UpdateUserCommand extends BaseCommand {
  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(program: Command, guid: string, options: any): Promise<void> {
    try {
      const updateUserDto = new UpdateUserDto(options);
      const manageUsersService = Container.get(ManageUsersService);
      const updatedUser = await manageUsersService.updateUser(
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

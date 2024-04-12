import { Command } from 'commander';
import { Service, Inject } from 'typedi';
import { ManageUsersService } from 'application/usecase/manageUsers/ManageUsersService';
import BaseCommand from '../BaseCommand';

@Service()
export default class ListUsersCommand extends BaseCommand {
  @Inject()
  private manageUsersService: ManageUsersService;

  async execute(program: Command): Promise<void> {
    try {
      const users = await this.manageUsersService.getAllUsers();
      // eslint-disable-next-line no-console
      console.log('List of Users:', users);
    } catch (error) {
      this.handleError(program, error);
    }
  }
}

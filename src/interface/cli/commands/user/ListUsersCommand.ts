import { Command } from 'commander';
import { Service, Inject } from 'typedi';
import { UserService } from 'application/usecase/user/UserService';
import BaseCommand from '../BaseCommand';

@Service()
export default class ListUsersCommand extends BaseCommand {
  @Inject()
  private manageUsersService: UserService;

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

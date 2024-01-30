import { Command } from 'commander';
import { Service, Container } from 'typedi';
import { ManageUsersService } from 'application/usecase/manageUsers/ManageUsersService';
import BaseCommand from './BaseCommand';

@Service()
export class ListUsersCommand extends BaseCommand {
  constructor() {
    super();
  }

  async execute(program: Command): Promise<void> {
    try {
      const manageUsersService = Container.get(ManageUsersService);
      const users = await manageUsersService.getAllUsers();
      console.log('List of Users:', users);
    } catch (error) {
      this.handleError(program, error);
    }
  }
}

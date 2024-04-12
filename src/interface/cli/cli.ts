import 'reflect-metadata';
import '../../diconfig';
import Container from 'typedi';
import { Command } from 'commander';
import { AppDataSource } from 'infrastructure/persistence/data-source';
import {
  RegisterCommand,
  RegisterCommandOptions,
} from './commands/RegisterCommand';
import { ListUsersCommand } from './commands/ListUsersCommand';
import { UpdateUserCommand } from './commands/UpdateUserCommand';
import { CreateOrganizationCommand } from './commands/CreateOrganizationCommand';

const runProgram = async () => {
  const program = new Command();
  program
    .command('register')
    .description('Register a new user')
    .requiredOption('-u, --username <username>', 'Username')
    .requiredOption('-p, --password <password>', 'Password')
    .requiredOption('-f, --firstname <firstname>', 'First name')
    .option('-l, --lastname <lastname>', 'Last name (optional)')
    .option('-e, --email <email>', 'Email')
    .option('-ph, --phone <phone>', 'Phone number')
    .option('-v, --isVendor', 'Is vendor', false)
    .action(async (options) => {
      const registerCommand = Container.get(RegisterCommand);
      try {
        await registerCommand.execute(
          program,
          options as RegisterCommandOptions,
        );
      } catch (error: unknown) {
        /* eslint-disable-next-line no-console */
        console.log(error);
      }
    });

  program
    .command('users/list')
    .description('List all users')
    .action(async () => {
      const command = Container.get(ListUsersCommand);
      await command.execute(program);
    });

  program
    .command('users/update <guid>')
    .description('Update user attributes')
    .option('-u, --username <username>', 'Username')
    .option('-f, --firstname <firstname>', 'First name')
    .option('-l, --lastname <lastname>', 'Last name (optional)')
    .option('-e, --email <email>', 'Email')
    .option('-ph, --phone <phone>', 'Phone number')
    .option('-a, --isAdmin', 'Is admin', false)
    .option('-v, --isVendor', 'Is vendor', false)
    .option('-s, --status <status>', 'User status')
    .action(async (guid, options) => {
      const command = Container.get(UpdateUserCommand);
      await command.execute(program, guid, options);
    });

  program
    .command('organizations/create <userGuid>')
    .description(
      'Create a new organization. User GUID is a creator of the organization',
    )
    .requiredOption('-t, --title <title>', 'Title of the organization')
    .requiredOption(
      '-p, --phoneNumber <phoneNumber>',
      'Phone number of the organization',
    )
    .requiredOption('-e, --email <email>', 'Email address of the organization')
    .requiredOption(
      '-c, --cityGuid <cityGuid>',
      'City GUID of the organization',
    )
    .option(
      '-r, --registrationNumber <registrationNumber>',
      'Registration number of the organization',
    )
    .action(async (userGuid, options) => {
      const command = Container.get(CreateOrganizationCommand);
      await command.execute(program, userGuid, options);
    });

  program.parse();
};

// Type ORM works only after the connection is initialized
AppDataSource.initialize()
  .then(runProgram)
  /* eslint-disable-next-line no-console */
  .catch((error) => console.log(error));

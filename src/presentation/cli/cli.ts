import 'reflect-metadata';
import '../../di/diconfig';
import Container from 'typedi';
import { Command } from 'commander';
import { AppDataSource } from 'adapter/persistence/data-source';
import RegisterCommand from './commands/user/RegisterCommand';
import ListUsersCommand from './commands/user/ListUsersCommand';
import UpdateUserCommand from './commands/user/UpdateUserCommand';
import CreateOrganizationCommand from './commands/organization/CreateOrganizationCommand';
import UpdateOrganizationCommand from './commands/organization/UpdateOrganizationCommand';

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
        await registerCommand.execute(program, options);
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
    .command('orgs/create <userGuid>')
    .description(
      'Create a new organization. User GUID is a creator of the organization',
    )
    .requiredOption('-t, --title <title>', 'Title of the organization')
    .requiredOption('-p, --phone <phone>', 'Phone number of the organization')
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

  program
    .command('orgs/update <organizationGuid>')
    .description('Update organization attributes')
    .option('-t, --title <title>', 'Title of the organization')
    .option('-p, --phone <phone>', 'Phone number of the organization')
    .option('-e, --email <email>', 'Email address of the organization')
    .option('-c, --cityGuid <cityGuid>', 'City GUID of the organization')
    .option(
      '-r, --registrationNumber <registrationNumber>',
      'Registration number of the organization',
    )
    .action(async (organizationGuid, options) => {
      const command = Container.get(UpdateOrganizationCommand);
      await command.execute(program, organizationGuid, options);
    });

  program.parse();
};

// Type ORM works only after the connection is initialized
AppDataSource.initialize()
  .then(runProgram)
  /* eslint-disable-next-line no-console */
  .catch((error) => console.log(error));

import 'reflect-metadata';
import '../../diconfig';
import Container from 'typedi';
import { Command } from 'commander';
import {
  RegisterCommand,
  RegisterCommandOptions,
} from './commands/RegisterCommand';
import { AppDataSource } from 'infrastructure/persistence/data-source';

const runProgram = async () => {
  const program = new Command();
  program
    .command('register')
    .description('Register a new user')
    .option('-u, --username <username>', 'Username')
    .option('-p, --password <password>', 'Password')
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
  program.parse();
};

// Type ORM works only after the connection is initialized
AppDataSource.initialize()
  .then(runProgram)
  /* eslint-disable-next-line no-console */
  .catch((error) => console.log(error));

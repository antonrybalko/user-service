import 'reflect-metadata';
import { AppDataSource } from '../src/adapter/persistence/data-source';

beforeAll(async () => {
  // Suppress console output during tests to prevent tslog noise
  // eslint-disable-next-line no-console
  console.log = jest.fn();
  // eslint-disable-next-line no-console
  console.error = jest.fn();

  // Wait for database connection
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

// Set up global test timeout
jest.setTimeout(30000);

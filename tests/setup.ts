import 'reflect-metadata';
import { AppDataSource } from '../src/adapter/persistence/data-source';

// Global setup for integration tests
beforeAll(async () => {
  // Wait for database connection
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

// Set up global test timeout
jest.setTimeout(30000);

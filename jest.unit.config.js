module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  testMatch: ['**/src/**/*.test.ts'], // Only test files in src folder
  testPathIgnorePatterns: ['/node_modules/', '/tests/'], // Explicitly ignore tests folder
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/tests/'],
  moduleNameMapper: {
    '^adapter/(.*)$': '<rootDir>/src/adapter/$1',
    '^presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^shared/(.*)$': '<rootDir>/src/shared/$1',
    '^application/(.*)$': '<rootDir>/src/application/$1',
    '^entity/(.*)$': '<rootDir>/src/entity/$1',
    '^di/(.*)$': '<rootDir>/src/di/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
};

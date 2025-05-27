module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  testMatch: ['**/*.test.ts'],
  // setupFilesAfterEnv: ['./tests/setup.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^adapter/(.*)$': '<rootDir>/src/adapter/$1',
    '^presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^shared/(.*)$': '<rootDir>/src/shared/$1',
    '^application/(.*)$': '<rootDir>/src/application/$1',
    '^entity/(.*)$': '<rootDir>/src/entity/$1',
    '^di/(.*)$': '<rootDir>/src/di/$1',
  },
};

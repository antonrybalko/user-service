module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/*.test.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  // setupFilesAfterEnv: ['./tests/setup.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '^shared/(.*)$': '<rootDir>/src/shared/$1',
    '^application/(.*)$': '<rootDir>/src/application/$1',
    '^domain/(.*)$': '<rootDir>/src/domain/$1',
  },
};

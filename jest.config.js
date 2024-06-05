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
  moduleNameMapper: {
    '^infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^interface/(.*)$': '<rootDir>/src/interface/$1',
    '^shared/(.*)$': '<rootDir>/src/shared/$1',
    '^application/(.*)$': '<rootDir>/src/application/$1',
    '^domain/(.*)$': '<rootDir>/src/domain/$1',
  },
};

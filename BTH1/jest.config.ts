import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
  collectCoverageFrom: ['src/features/**/*.{ts,tsx}'],
  coverageThreshold: {
    'src/features/': {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
  // Tránh transform node_modules
  transformIgnorePatterns: ['node_modules/(?!(zustand)/)'],
};

export default config;

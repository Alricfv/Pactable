const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // A more comprehensive rule to handle multiple ESM libraries
  transformIgnorePatterns: [
    '/node_modules/(?!(@headlessui/react|@heroicons/react|lucide-react|pdf-lib)/)',
  ],
}

module.exports = createJestConfig(customJestConfig)
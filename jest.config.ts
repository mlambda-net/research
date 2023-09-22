import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  moduleNameMapper: {
    '^@MLambda/(.*)$': '<rootDir>/src/$1',
  },
}

export default config

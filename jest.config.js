/** @type {import('jest').Config} */
const jestConfig = {
  preset: "ts-jest",

  moduleNameMapper: {
    "^@helpers/(.*)$": "<rootDir>/src/helpers/$1",
    "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@models/(.*)$": "<rootDir>/src/models/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@scss/(.*)$": "<rootDir>/src/scss/$1",
  },

  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },

  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}", "!src/**/*.d.ts"],
};

module.exports = jestConfig;

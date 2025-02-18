const dotenv = require('dotenv');
dotenv.config();

const isProductionEnv = process.env.APP_ENV === "production";

module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  testPathIgnorePatterns: process.env.CI 
  ? ['<rootDir>/src/tests/integration/modules/.*\\.controller\\.spec\\.ts$']
  : isProductionEnv 
    ? ['<rootDir>/src/tests/integration/modules/.*\\.controller\\.spec\\.ts$']
    : [],
};

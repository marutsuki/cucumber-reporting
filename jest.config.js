const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {
      useESM: true
    }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  moduleDirectories: [
    "<rootDir>",
    "node_modules"
  ],
  modulePathIgnorePatterns: ['<rootDir>/build'],
};
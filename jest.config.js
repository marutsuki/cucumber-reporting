/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {
      useESM: true
    }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '(.+)\\.js': '$1'
  },
  moduleDirectories: [
    "node_modules"
  ],
  modulePathIgnorePatterns: ['<rootDir>/build'],
};
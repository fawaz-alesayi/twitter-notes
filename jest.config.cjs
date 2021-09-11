module.exports = {
  moduleNameMapper: {
    '@/src/(.*)': '<rootDir>/src/$1',
    '@src/(.*)': '<rootDir>/src/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
  },
  testEnvironment: 'node',
};

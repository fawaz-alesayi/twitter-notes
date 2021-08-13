module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
      '@/src/(.*)': '<rootDir>/src/$1',
      "@src/(.*)": "<rootDir>/src/$1",
      "@utils/(.*)": "<rootDir>/src/utils/$1",
    },
  };
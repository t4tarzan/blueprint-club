const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    'react-markdown': '<rootDir>/node_modules/react-markdown/react-markdown.min.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-markdown|vfile|unist-.*|unified|bail|is-plain-obj|trough|remark-.*|mdast-util-.*|micromark.*|decode-named-character-reference|character-entities|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|pretty-bytes|@tanstack/react-query|@swc/core|@swc/jest)',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};

module.exports = createJestConfig(customJestConfig);

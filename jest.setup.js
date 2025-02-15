// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Add TextEncoder and TextDecoder polyfills for Node.js environment
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Add BroadcastChannel polyfill
global.BroadcastChannel = class {
  constructor() {}
  postMessage() {}
  addEventListener() {}
  removeEventListener() {}
  close() {}
};

// Extend Jest matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null;
    return {
      message: () => `expected ${received} to be in the document`,
      pass,
    };
  },
  toContain(received, expected) {
    const pass = received.includes(expected);
    return {
      message: () => `expected ${received} to contain ${expected}`,
      pass,
    };
  },
  toBe(received, expected) {
    const pass = Object.is(received, expected);
    return {
      message: () => `expected ${received} to be ${expected}`,
      pass,
    };
  },
  toEqual(received, expected) {
    const pass = this.equals(received, expected);
    return {
      message: () => `expected ${received} to equal ${expected}`,
      pass,
    };
  },
});

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(() => null),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.NEXTAUTH_URL = 'http://localhost:3000';

// Suppress console errors and warnings in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

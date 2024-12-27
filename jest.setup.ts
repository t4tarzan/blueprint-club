import '@testing-library/jest-dom';

type MockAudioContext = {
  createAnalyser: () => {
    connect: jest.Mock;
    disconnect: jest.Mock;
    fftSize: number;
    getByteFrequencyData: jest.Mock;
  };
  createMediaStreamSource: () => {
    connect: jest.Mock;
    disconnect: jest.Mock;
  };
};

declare global {
  // @ts-ignore - Override browser types for testing
  var SpeechRecognition: jest.Mock;
  // @ts-ignore - Override browser types for testing
  var webkitSpeechRecognition: jest.Mock;
  // @ts-ignore - Override browser types for testing
  var AudioContext: jest.MockedFunction<() => MockAudioContext>;
  // @ts-ignore - Override browser types for testing
  var webkitAudioContext: jest.MockedFunction<() => MockAudioContext>;
}

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
  }),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { email: 'test@example.com' } },
    status: 'authenticated',
  }),
}));

// Mock SpeechRecognition
const mockSpeechRecognition = {
  start: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// @ts-ignore - Override browser types for testing
globalThis.SpeechRecognition = jest.fn(() => mockSpeechRecognition);
// @ts-ignore - Override browser types for testing
globalThis.webkitSpeechRecognition = jest.fn(() => mockSpeechRecognition);

// Mock AudioContext
const MockAudioContext = jest.fn().mockImplementation(() => ({
  createAnalyser: () => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    fftSize: 32,
    getByteFrequencyData: jest.fn(),
  }),
  createMediaStreamSource: () => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
  }),
}));

// @ts-ignore - Override browser types for testing
globalThis.AudioContext = MockAudioContext;
// @ts-ignore - Override browser types for testing
globalThis.webkitAudioContext = MockAudioContext;

// Mock window.URL
Object.defineProperty(globalThis.URL, 'createObjectURL', { value: jest.fn() });
Object.defineProperty(globalThis.URL, 'revokeObjectURL', { value: jest.fn() });

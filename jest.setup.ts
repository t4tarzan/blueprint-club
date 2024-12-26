import '@testing-library/jest-dom';

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

// Mock SpeechRecognition API
const mockSpeechRecognition = {
  start: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

global.SpeechRecognition = jest.fn(() => mockSpeechRecognition);
global.webkitSpeechRecognition = jest.fn(() => mockSpeechRecognition);

// Mock AudioContext
class MockAudioContext {
  createAnalyser() {
    return {
      connect: jest.fn(),
      disconnect: jest.fn(),
      fftSize: 32,
      getByteFrequencyData: jest.fn(),
    };
  }
  
  createMediaStreamSource() {
    return {
      connect: jest.fn(),
      disconnect: jest.fn(),
    };
  }
}

global.AudioContext = MockAudioContext as any;
global.webkitAudioContext = MockAudioContext as any;

// Mock window.URL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

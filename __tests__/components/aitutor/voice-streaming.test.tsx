import React from 'react';
import { render, act } from '@testing-library/react';
import { VoiceStreaming } from '@/components/aitutor/voice-streaming';

// Mock Web Audio API
const mockAnalyserNode = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  getByteFrequencyData: jest.fn((array) => {
    array.fill(128);
  }),
  frequencyBinCount: 1024,
  fftSize: 2048,
};

const mockMediaStreamSource = {
  connect: jest.fn(),
  disconnect: jest.fn(),
};

const mockAudioContext = {
  createAnalyser: jest.fn(() => mockAnalyserNode),
  createMediaStreamSource: jest.fn(() => mockMediaStreamSource),
  state: 'running',
  close: jest.fn(),
};

// Mock Web Speech API
let mockSpeechRecognitionInstance;
class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  lang = '';
  onresult = null;
  onerror = null;
  onend = null;
  start = jest.fn();
  stop = jest.fn();
}

// Mock window object
const originalWindow = { ...window };
const mockStream = { getTracks: () => [{ stop: jest.fn() }] };

// Track getUserMedia resolution
let getUserMediaResolve;
let getUserMediaPromise;

beforeEach(() => {
  getUserMediaPromise = new Promise(resolve => {
    getUserMediaResolve = resolve;
  });
});

beforeAll(() => {
  // Define window.webkitSpeechRecognition
  Object.defineProperty(window, 'webkitSpeechRecognition', {
    value: jest.fn().mockImplementation(() => {
      mockSpeechRecognitionInstance = new MockSpeechRecognition();
      return mockSpeechRecognitionInstance;
    }),
    writable: true,
    configurable: true
  });

  // Mock window.AudioContext
  Object.defineProperty(window, 'AudioContext', {
    value: jest.fn().mockImplementation(() => mockAudioContext),
    writable: true
  });

  // Mock getUserMedia
  global.navigator.mediaDevices = {
    getUserMedia: jest.fn().mockImplementation(async () => {
      const stream = mockStream;
      await new Promise(resolve => setTimeout(resolve, 10));
      getUserMediaResolve();
      return stream;
    })
  };

  // Mock other window functions
  window.requestAnimationFrame = jest.fn(cb => {
    // Actually run the callback to trigger state updates
    cb();
    return 1;
  });
  window.URL.createObjectURL = jest.fn();
  window.URL.revokeObjectURL = jest.fn();
});

afterAll(() => {
  window = originalWindow;
});

const defaultProps = {
  isActive: false,
  selectedTeacher: 'math' as const,
  onSpeechResult: jest.fn(),
  onSpeechEnd: jest.fn(),
  onError: jest.fn(),
};

describe('VoiceStreaming', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSpeechRecognitionInstance = null;
  });

  it('initializes speech recognition when active', async () => {
    // Create a promise to track when start is called
    let startCalled = false;
    const startPromise = new Promise<void>(resolve => {
      const originalStart = mockSpeechRecognitionInstance?.start || (() => {});
      MockSpeechRecognition.prototype.start = function() {
        startCalled = true;
        originalStart.call(this);
        resolve();
      };
    });

    // Render component with isActive=true
    render(<VoiceStreaming {...defaultProps} isActive={true} />);

    // Wait for both getUserMedia and start to be called
    await act(async () => {
      await Promise.all([getUserMediaPromise, startPromise]);
    });

    // Verify initialization
    expect(window.webkitSpeechRecognition).toHaveBeenCalled();
    expect(mockSpeechRecognitionInstance).toBeTruthy();
    expect(startCalled).toBe(true);
  });

  it('stops speech recognition when inactive', async () => {
    // First render with isActive=true
    const { rerender } = render(<VoiceStreaming {...defaultProps} isActive={true} />);

    // Wait for initialization
    await act(async () => {
      await getUserMediaPromise;
      await new Promise(resolve => setTimeout(resolve, 20));
    });

    // Then set to inactive
    rerender(<VoiceStreaming {...defaultProps} isActive={false} />);

    expect(mockSpeechRecognitionInstance.stop).toHaveBeenCalled();
  });

  it('handles speech recognition results', async () => {
    // Render with isActive=true
    render(<VoiceStreaming {...defaultProps} isActive={true} />);

    // Wait for initialization
    await act(async () => {
      await getUserMediaPromise;
      await new Promise(resolve => setTimeout(resolve, 20));

      // Simulate speech result
      const mockEvent = {
        results: [[{ transcript: 'test transcript' }]],
      };
      mockSpeechRecognitionInstance.onresult(mockEvent);
    });

    expect(defaultProps.onSpeechResult).toHaveBeenCalledWith('test transcript');
  });

  it('handles speech recognition errors', async () => {
    // Render with isActive=true
    render(<VoiceStreaming {...defaultProps} isActive={true} />);

    // Wait for initialization
    await act(async () => {
      await getUserMediaPromise;
      await new Promise(resolve => setTimeout(resolve, 20));

      // Simulate error
      const mockError = new Error('Speech recognition error');
      mockSpeechRecognitionInstance.onerror({ error: mockError });
    });

    expect(defaultProps.onError).toHaveBeenCalledWith('Speech recognition error: Error: Speech recognition error');
  });

  it('handles audio visualization', async () => {
    // Render with isActive=true
    render(<VoiceStreaming {...defaultProps} isActive={true} />);

    // Wait for initialization
    await act(async () => {
      await getUserMediaPromise;
      await new Promise(resolve => setTimeout(resolve, 20));
    });

    expect(mockAnalyserNode.getByteFrequencyData).toHaveBeenCalled();
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });
});

import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AITutor from '@/pages/aitutor';

// Mock next-auth
jest.mock('next-auth/react');
const mockUseSession = useSession as jest.Mock;

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
const mockUseRouter = useRouter as jest.Mock;

// Mock fetch
global.fetch = jest.fn();

describe('AITutor Page', () => {
  const mockSession = {
    data: { user: { email: 'test@example.com' } },
    status: 'authenticated',
  };

  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    mockUseSession.mockReturnValue(mockSession);
    mockUseRouter.mockReturnValue(mockRouter);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ questionsLeft: 2 }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login if not authenticated', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<AITutor />);
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
  });

  it('loads initial session data', async () => {
    render(<AITutor />);
    await waitFor(() => {
      expect(screen.getByText('Questions remaining: 2')).toBeInTheDocument();
    });
  });

  it('handles teacher selection', () => {
    render(<AITutor />);
    fireEvent.click(screen.getByText('Mr. David'));
    expect(screen.getByTestId('teacher-card-math')).toHaveClass('scale-105');
  });

  it('prevents teacher selection during active call', async () => {
    render(<AITutor />);
    
    // Start call
    fireEvent.click(screen.getByText('Mr. David'));
    fireEvent.click(screen.getByText('Start Call'));
    
    // Try to select another teacher
    fireEvent.click(screen.getByText('Ms. Sarah'));
    expect(screen.getByTestId('teacher-card-math')).toHaveClass('scale-105');
    expect(screen.getByTestId('teacher-card-science')).not.toHaveClass('scale-105');
  });

  it('processes speech results correctly', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        solution: '# Solution\nHere is your answer',
        questionsLeft: 1,
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(<AITutor />);
    
    // Select teacher and start call
    fireEvent.click(screen.getByText('Mr. David'));
    fireEvent.click(screen.getByText('Start Call'));

    // Simulate speech result
    const voiceStreaming = screen.getByTestId('voice-streaming');
    fireEvent.speechResult(voiceStreaming, { result: 'What is 2+2?' });

    await waitFor(() => {
      expect(screen.getByText('Solution')).toBeInTheDocument();
      expect(screen.getByText('Here is your answer')).toBeInTheDocument();
      expect(screen.getByText('Questions remaining: 1')).toBeInTheDocument();
    });
  });

  it('shows error message on API failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<AITutor />);
    
    // Select teacher and start call
    fireEvent.click(screen.getByText('Mr. David'));
    fireEvent.click(screen.getByText('Start Call'));

    // Simulate speech result
    const voiceStreaming = screen.getByTestId('voice-streaming');
    fireEvent.speechResult(voiceStreaming, { result: 'What is 2+2?' });

    await waitFor(() => {
      expect(screen.getByText('Error processing your question. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows waitlist message when no questions left', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ questionsLeft: 0 }),
    });

    render(<AITutor />);
    
    await waitFor(() => {
      expect(screen.getByText('Join the waitlist for full access')).toBeInTheDocument();
      expect(screen.getByText('Start Call')).toBeDisabled();
    });
  });
});

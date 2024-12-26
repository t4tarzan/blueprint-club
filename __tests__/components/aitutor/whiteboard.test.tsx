import { render, screen } from '@testing-library/react';
import { Whiteboard } from '@/components/aitutor/whiteboard';

describe('Whiteboard', () => {
  const defaultProps = {
    content: '',
    isProcessing: false,
    selectedSubject: null as 'math' | 'science' | null,
    isCallActive: false,
  };

  it('renders initial state correctly', () => {
    render(<Whiteboard {...defaultProps} />);
    expect(screen.getByText('Select a subject to begin')).toBeInTheDocument();
  });

  it('shows loading state when processing', () => {
    render(<Whiteboard {...defaultProps} isProcessing={true} />);
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('renders markdown content correctly', () => {
    const content = '# Test Header\n\nTest content with *emphasis*';
    render(<Whiteboard {...defaultProps} content={content} />);
    
    expect(screen.getByRole('heading', { name: 'Test Header' })).toBeInTheDocument();
    expect(screen.getByText('Test content with emphasis')).toBeInTheDocument();
  });

  it('renders math expressions correctly', () => {
    const content = 'When $a \\neq 0$, there are two solutions to $ax^2 + bx + c = 0$';
    render(<Whiteboard {...defaultProps} content={content} />);
    
    expect(screen.getByTestId('math-content')).toBeInTheDocument();
  });

  it('shows appropriate message when call is active but no content', () => {
    render(<Whiteboard {...defaultProps} isCallActive={true} selectedSubject="math" />);
    expect(screen.getByText("Ask your question to begin")).toBeInTheDocument();
  });

  it('preserves code blocks in content', () => {
    const content = '```python\ndef hello():\n    print("Hello")\n```';
    render(<Whiteboard {...defaultProps} content={content} />);
    
    expect(screen.getByTestId('code-block')).toBeInTheDocument();
    expect(screen.getByText('def hello():')).toBeInTheDocument();
  });
});

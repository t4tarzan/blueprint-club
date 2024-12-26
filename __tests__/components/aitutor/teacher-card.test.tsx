import { render, screen } from '@testing-library/react';
import { TeacherCard } from '@/components/aitutor/teacher-card';
import userEvent from '@testing-library/user-event';

describe('TeacherCard', () => {
  const defaultProps = {
    teacher: 'math' as const,
    isSelected: false,
    isCallActive: false,
    onClick: jest.fn(),
  };

  it('renders math teacher correctly', () => {
    render(<TeacherCard {...defaultProps} />);
    expect(screen.getByText('Mr. David')).toBeInTheDocument();
    expect(screen.getByText('Math Teacher')).toBeInTheDocument();
  });

  it('renders science teacher correctly', () => {
    render(<TeacherCard {...defaultProps} teacher="science" />);
    expect(screen.getByText('Ms. Sarah')).toBeInTheDocument();
    expect(screen.getByText('Science Teacher')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const onClick = jest.fn();
    render(<TeacherCard {...defaultProps} onClick={onClick} />);
    const card = screen.getByRole('button');
    await userEvent.click(card);
    expect(onClick).toHaveBeenCalled();
  });

  it('shows selected state correctly', () => {
    render(<TeacherCard {...defaultProps} isSelected={true} />);
    const card = screen.getByRole('button');
    expect(card).toHaveClass('scale-105');
  });

  it('shows speaking indicator when selected and call is active', () => {
    render(<TeacherCard {...defaultProps} isSelected={true} isCallActive={true} />);
    const indicator = screen.getByTestId('speaking-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('text-green-600');
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeacherCard } from '@/components/aitutor/teacher-card';

describe('TeacherCard', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders math teacher card correctly', () => {
    render(
      <TeacherCard
        teacher="math"
        isSelected={false}
        onSelect={mockOnSelect}
        disabled={false}
      />
    );
    expect(screen.getByText('Mr. David')).toBeInTheDocument();
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
  });

  it('renders science teacher card correctly', () => {
    render(
      <TeacherCard
        teacher="science"
        isSelected={false}
        onSelect={mockOnSelect}
        disabled={false}
      />
    );
    expect(screen.getByText('Ms. Sarah')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    render(
      <TeacherCard
        teacher="math"
        isSelected={false}
        onSelect={mockOnSelect}
        disabled={false}
      />
    );
    await user.click(screen.getByRole('button'));
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('shows selected state', () => {
    render(
      <TeacherCard
        teacher="math"
        isSelected={true}
        onSelect={mockOnSelect}
        disabled={false}
      />
    );
    expect(screen.getByText('Currently Selected')).toBeInTheDocument();
  });

  it('handles disabled state', async () => {
    const user = userEvent.setup();
    render(
      <TeacherCard
        teacher="math"
        isSelected={false}
        onSelect={mockOnSelect}
        disabled={true}
      />
    );
    await user.click(screen.getByRole('button'));
    expect(mockOnSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveClass('cursor-not-allowed');
  });
});

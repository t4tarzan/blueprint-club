import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { AuditLogs } from '../../components/teams/AuditLogs';
import { mockTeam, mockAuditLog, mockApiResponse } from '../utils/test-utils';

// Mock fetch
global.fetch = jest.fn();

describe('AuditLogs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation(() =>
      mockApiResponse(200, {
        logs: [mockAuditLog],
        pagination: {
          total: 1,
          pages: 1,
          page: 1,
          limit: 50,
        },
      })
    );
  });

  it('renders audit logs table correctly', async () => {
    render(<AuditLogs team={mockTeam} />);

    // Check if loading state is shown initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Check if table headers are rendered
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('IP Address')).toBeInTheDocument();

    // Check if log data is rendered
    expect(screen.getByText(mockAuditLog.action)).toBeInTheDocument();
    expect(screen.getByText(mockAuditLog.user.name)).toBeInTheDocument();
    expect(screen.getByText(mockAuditLog.status)).toBeInTheDocument();
    expect(screen.getByText(mockAuditLog.ipAddress)).toBeInTheDocument();
  });

  it('handles filtering correctly', async () => {
    render(<AuditLogs team={mockTeam} />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Change category filter
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'auth' },
    });

    // Change status filter
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'success' },
    });

    // Verify that fetch was called with correct filters
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('category=auth'),
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('status=success'),
        expect.any(Object)
      );
    });
  });

  it('handles date range filtering correctly', async () => {
    render(<AuditLogs team={mockTeam} />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Set date range
    const startDate = '2024-01-01';
    const endDate = '2024-12-31';

    fireEvent.change(screen.getAllByLabelText('Date Range')[0], {
      target: { value: startDate },
    });

    fireEvent.change(screen.getAllByLabelText('Date Range')[1], {
      target: { value: endDate },
    });

    // Verify that fetch was called with correct date range
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`startDate=${startDate}`),
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`endDate=${endDate}`),
        expect.any(Object)
      );
    });
  });

  it('handles export functionality correctly', async () => {
    const originalWindow = global.window;
    global.window = {
      ...originalWindow,
      location: { href: '' } as Location
    } as Window & typeof globalThis;

    render(<AuditLogs team={mockTeam} />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Click export button
    fireEvent.click(screen.getByText('Export'));

    // Verify that export URL was set correctly
    expect(global.window.location.href).toContain(
      `/api/teams/${mockTeam.id}/audit-logs/export`
    );

    global.window = originalWindow;
  });

  it('handles error states correctly', async () => {
    // Mock fetch to return an error
    (global.fetch as jest.Mock).mockImplementation(() =>
      mockApiResponse(500, { message: 'Internal server error' })
    );

    render(<AuditLogs team={mockTeam} />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to load audit logs')).toBeInTheDocument();
    });
  });

  it('handles empty state correctly', async () => {
    // Mock fetch to return empty logs
    (global.fetch as jest.Mock).mockImplementation(() =>
      mockApiResponse(200, {
        logs: [],
        pagination: {
          total: 0,
          pages: 0,
          page: 1,
          limit: 50,
        },
      })
    );

    render(<AuditLogs team={mockTeam} />);

    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText('No audit logs found')).toBeInTheDocument();
    });
  });

  it('handles pagination correctly', async () => {
    // Mock fetch to return multiple pages
    (global.fetch as jest.Mock).mockImplementation(() =>
      mockApiResponse(200, {
        logs: [mockAuditLog],
        pagination: {
          total: 100,
          pages: 2,
          page: 1,
          limit: 50,
        },
      })
    );

    render(<AuditLogs team={mockTeam} />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Click next page button
    fireEvent.click(screen.getByText('Next'));

    // Verify that fetch was called with correct page number
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
    });
  });
});

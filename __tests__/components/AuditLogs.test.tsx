import React from 'react';
import { screen, waitFor, fireEvent, render, within } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { AuditLogs } from '@/components/teams/AuditLogs';
import { renderWithProviders, mockTeam, mockAuditLog, mockUser } from '../utils/test-utils';
import type { AuditLog } from '@/types';
import { formatDate } from '@/lib/utils';

// Mock date-fns format
jest.mock('date-fns/format', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((date) => date.toISOString()),
}));

// Mock heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  CalendarIcon: () => <div data-testid="calendar-icon" />,
  ArrowPathIcon: () => <div data-testid="arrow-path-icon" />,
  ArrowDownTrayIcon: () => <div data-testid="arrow-down-tray-icon" />,
}));

const server = setupServer(
  rest.get('/api/teams/:teamId/audit-logs', (req, res, ctx) => {
    return res(
      ctx.json({
        logs: [mockAuditLog],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
        },
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AuditLogs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders audit logs', async () => {
    renderWithProviders(<AuditLogs team={{ ...mockTeam, members: mockTeam.members }} />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      const rows = within(table).getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1); // Header + data row
      expect(within(rows[1]).getByText(mockAuditLog.action)).toBeInTheDocument();
    });
  });

  it('renders error state', async () => {
    server.use(
      rest.get('/api/teams/:teamId/audit-logs', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Error loading audit logs' }));
      })
    );

    renderWithProviders(<AuditLogs team={{ ...mockTeam, members: mockTeam.members }} />);

    await waitFor(() => {
      expect(screen.getByText('Error loading audit logs')).toBeInTheDocument();
    });
  });

  it('renders empty state', async () => {
    server.use(
      rest.get('/api/teams/:teamId/audit-logs', (req, res, ctx) => {
        return res(
          ctx.json({
            logs: [],
            pagination: {
              total: 0,
              page: 1,
              limit: 10,
            },
          })
        );
      })
    );

    renderWithProviders(<AuditLogs team={{ ...mockTeam, members: mockTeam.members }} />);

    await waitFor(() => {
      expect(screen.getByText('No audit logs found')).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    renderWithProviders(<AuditLogs team={{ ...mockTeam, members: mockTeam.members }} />);

    await waitFor(() => {
      const pagination = screen.getByText(/showing page/i);
      expect(pagination).toBeInTheDocument();
      expect(pagination).toHaveTextContent('1');
    });
  });

  it('renders audit logs correctly', async () => {
    renderWithProviders(<AuditLogs team={{ ...mockTeam, members: mockTeam.members }} />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      const rows = within(table).getAllByRole('row');
      const cells = within(rows[1]).getAllByRole('cell');
      
      expect(cells[2]).toHaveTextContent(mockAuditLog.action);
      expect(cells[3]).toHaveTextContent(mockAuditLog.category);
      expect(cells[4]).toHaveTextContent(mockAuditLog.status);
    });
  });

  it('handles empty audit logs', async () => {
    server.use(
      rest.get('/api/teams/:teamId/audit-logs', (req, res, ctx) => {
        return res(
          ctx.json({
            logs: [],
            pagination: {
              total: 0,
              page: 1,
              limit: 10,
            },
          })
        );
      })
    );

    renderWithProviders(<AuditLogs team={{ ...mockTeam, members: mockTeam.members }} />);

    await waitFor(() => {
      expect(screen.getByText('No audit logs found')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    server.use(
      rest.get('/api/teams/:teamId/audit-logs', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Error loading audit logs' }));
      })
    );

    renderWithProviders(<AuditLogs team={{ ...mockTeam, members: mockTeam.members }} />);

    await waitFor(() => {
      expect(screen.getByText('Error loading audit logs')).toBeInTheDocument();
    });
  });
});

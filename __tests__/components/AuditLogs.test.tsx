import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { AuditLogs } from '@/components/teams/AuditLogs';
import { renderWithProviders } from '../utils/test-utils';
import { mockTeam } from '../fixtures/team';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      logs: [
        {
          id: '1',
          action: 'created',
          actor: { name: 'John Doe', email: 'john@example.com' },
          target: 'document',
          metadata: { name: 'test.doc' },
          createdAt: new Date().toISOString(),
        },
      ],
      total: 1,
      page: 1,
      perPage: 10,
    }),
  })
) as jest.Mock;

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
      
      const cells = within(rows[1]).getAllByRole('cell');
      expect(cells[0]).toHaveTextContent('John Doe');
      expect(cells[1]).toHaveTextContent('created');
      expect(cells[2]).toHaveTextContent('document');
    });
  });

  it('renders empty state', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          logs: [],
          total: 0,
          page: 1,
          perPage: 10,
        }),
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

      expect(cells[0]).toHaveTextContent('John Doe');
      expect(cells[1]).toHaveTextContent('created');
      expect(cells[2]).toHaveTextContent('document');
      expect(cells[3]).toHaveTextContent('test.doc');
    });
  });

  it('handles empty audit logs', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          logs: [],
          total: 0,
          page: 1,
          perPage: 10,
        }),
      })
    );

    renderWithProviders(<AuditLogs team={{ ...mockTeam, members: mockTeam.members }} />);

    await waitFor(() => {
      expect(screen.getByText('No audit logs found')).toBeInTheDocument();
    });
  });
});

import { createMocks } from 'node-mocks-http';
import { mockSession, mockAuditLog, mockUser, mockTeam } from '../utils/test-utils';
import { getSession } from 'next-auth/react';

// Mock dependencies
jest.mock('next-auth/react');
jest.mock('../../lib/utils', () => ({
  ...jest.requireActual('../../lib/utils'),
  formatDate: jest.fn().mockImplementation((date) => new Date(date).toISOString()),
}));

const mockPrisma = {
  auditLog: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  teamMember: {
    findFirst: jest.fn(),
  },
};

jest.mock('../../lib/prisma', () => {
  return {
    __esModule: true,
    default: mockPrisma,
  };
});

// Import after mocking
const auditLogsHandler = require('../../pages/api/teams/[id]/audit-logs').default;
const exportHandler = require('../../pages/api/teams/[id]/audit-logs/export').default;

describe('Audit Logs API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSession as jest.Mock).mockResolvedValue(mockSession);
    mockPrisma.teamMember.findFirst.mockResolvedValue({
      role: 'OWNER',
    });
  });

  describe('GET /api/teams/[id]/audit-logs', () => {
    it('should return audit logs for authorized users', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          id: 'team-1',
        },
        headers: {
          cookie: 'next-auth.session-token=xyz',
        },
      });

      const mockData = [mockAuditLog];

      mockPrisma.auditLog.findMany.mockResolvedValue(mockData);
      mockPrisma.auditLog.count.mockResolvedValue(1);

      await auditLogsHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        logs: mockData,
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
        },
      });
    });

    it('should handle insufficient permissions', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          id: 'team-1',
        },
        headers: {
          cookie: 'next-auth.session-token=xyz',
        },
      });

      mockPrisma.teamMember.findFirst.mockResolvedValue(null);

      await auditLogsHandler(req, res);

      expect(res._getStatusCode()).toBe(403);
      expect(JSON.parse(res._getData())).toEqual({
        message: 'Insufficient permissions',
      });
    });

    it('should handle query parameters correctly', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          id: 'team-1',
          page: '2',
          limit: '20',
          category: 'auth',
          status: 'success',
        },
        headers: {
          cookie: 'next-auth.session-token=xyz',
        },
      });

      const mockData = [mockAuditLog];

      mockPrisma.auditLog.findMany.mockResolvedValue(mockData);
      mockPrisma.auditLog.count.mockResolvedValue(1);

      await auditLogsHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            teamId: 'team-1',
            category: 'auth',
            status: 'success',
          }),
          skip: 20,
          take: 20,
        })
      );
    });
  });

  describe('GET /api/teams/[id]/audit-logs/export', () => {
    it('should export audit logs as CSV for authorized users', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          id: 'team-1',
        },
        headers: {
          cookie: 'next-auth.session-token=xyz',
        },
      });

      const mockData = [mockAuditLog];

      mockPrisma.auditLog.findMany.mockResolvedValue(mockData);

      await exportHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res.getHeader('Content-Type')).toBe('text/csv');
      expect(res.getHeader('Content-Disposition')).toMatch(
        /^attachment; filename="audit-logs-team-1-.*\.csv"$/
      );
    });

    it('should handle date range filters for export', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          id: 'team-1',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        },
        headers: {
          cookie: 'next-auth.session-token=xyz',
        },
      });

      const mockData = [mockAuditLog];

      mockPrisma.auditLog.findMany.mockResolvedValue(mockData);

      await exportHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            teamId: 'team-1',
            createdAt: {
              gte: new Date('2024-01-01'),
              lte: new Date('2024-12-31'),
            },
          }),
        })
      );
    });
  });
});

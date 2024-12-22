import { createMocks } from 'node-mocks-http';
import auditLogsHandler from '../../pages/api/teams/[id]/audit-logs';
import exportHandler from '../../pages/api/teams/[id]/audit-logs/export';
import { mockSession, mockAuditLog } from '../utils/test-utils';
import { prisma } from '../../lib/prisma';
import { getSession } from 'next-auth/react';

// Mock dependencies
jest.mock('next-auth/react');
jest.mock('../../lib/prisma', () => ({
  prisma: {
    auditLog: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    teamMember: {
      findFirst: jest.fn(),
    },
  },
}));

describe('Audit Logs API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe('GET /api/teams/[id]/audit-logs', () => {
    it('should return audit logs for authorized users', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          id: 'team-1',
        },
      });

      // Mock team member check
      (prisma.teamMember.findFirst as jest.Mock).mockResolvedValue({
        role: 'OWNER',
      });

      // Mock audit logs query
      (prisma.auditLog.findMany as jest.Mock).mockResolvedValue([mockAuditLog]);
      (prisma.auditLog.count as jest.Mock).mockResolvedValue(1);

      await auditLogsHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        logs: [mockAuditLog],
        pagination: {
          total: 1,
          pages: 1,
          page: 1,
          limit: 50,
        },
      });
    });

    it('should handle unauthorized access', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          id: 'team-1',
        },
      });

      // Mock unauthorized user
      (getSession as jest.Mock).mockResolvedValue(null);

      await auditLogsHandler(req, res);

      expect(res._getStatusCode()).toBe(401);
      expect(JSON.parse(res._getData())).toEqual({
        message: 'Unauthorized',
      });
    });

    it('should handle insufficient permissions', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          id: 'team-1',
        },
      });

      // Mock member with insufficient permissions
      (prisma.teamMember.findFirst as jest.Mock).mockResolvedValue({
        role: 'MEMBER',
      });

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
          category: 'auth',
          status: 'success',
          page: '2',
          limit: '20',
        },
      });

      // Mock team member check
      (prisma.teamMember.findFirst as jest.Mock).mockResolvedValue({
        role: 'OWNER',
      });

      // Mock audit logs query
      (prisma.auditLog.findMany as jest.Mock).mockResolvedValue([mockAuditLog]);
      (prisma.auditLog.count as jest.Mock).mockResolvedValue(25);

      await auditLogsHandler(req, res);

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
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
      });

      // Mock team member check
      (prisma.teamMember.findFirst as jest.Mock).mockResolvedValue({
        role: 'OWNER',
      });

      // Mock audit logs query
      (prisma.auditLog.findMany as jest.Mock).mockResolvedValue([mockAuditLog]);

      await exportHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res.getHeader('Content-Type')).toBe('text/csv');
      expect(res.getHeader('Content-Disposition')).toMatch(
        /^attachment; filename="audit-logs-team-1-.*\.csv"$/
      );

      const csv = res._getData();
      expect(typeof csv).toBe('string');
      expect(csv).toContain('Timestamp,Action,Category,Status');
      expect(csv).toContain(mockAuditLog.action);
    });

    it('should handle unauthorized access for export', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          id: 'team-1',
        },
      });

      // Mock unauthorized user
      (getSession as jest.Mock).mockResolvedValue(null);

      await exportHandler(req, res);

      expect(res._getStatusCode()).toBe(401);
      expect(JSON.parse(res._getData())).toEqual({
        message: 'Unauthorized',
      });
    });

    it('should handle date range filters for export', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-12-31';

      const { req, res } = createMocks({
        method: 'GET',
        query: {
          id: 'team-1',
          startDate,
          endDate,
        },
      });

      // Mock team member check
      (prisma.teamMember.findFirst as jest.Mock).mockResolvedValue({
        role: 'OWNER',
      });

      // Mock audit logs query
      (prisma.auditLog.findMany as jest.Mock).mockResolvedValue([mockAuditLog]);

      await exportHandler(req, res);

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            teamId: 'team-1',
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }),
        })
      );
    });
  });
});

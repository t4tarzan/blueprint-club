import { AuditService } from '../../lib/boxyhq/audit-service';
import { prisma } from '../../lib/prisma';
import { mockAuditLog } from '../utils/test-utils';

// Mock Prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    auditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    session: {
      update: jest.fn(),
    },
  },
}));

describe('AuditService', () => {
  let auditService: AuditService;

  beforeEach(() => {
    auditService = AuditService.getInstance();
    jest.clearAllMocks();
  });

  describe('log', () => {
    it('should create an audit log entry', async () => {
      const logData = {
        teamId: 'team-1',
        userId: 'user-1',
        action: 'user.login' as const,
        category: 'auth' as const,
        status: 'success' as const,
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        metadata: { key: 'value' },
      };

      await auditService.log(logData);

      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: logData,
      });
    });

    it('should handle errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      (prisma.auditLog.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await auditService.log({
        action: 'user.login',
        category: 'auth',
        status: 'success',
      });

      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe('getLogs', () => {
    it('should fetch audit logs with filters', async () => {
      const filters = {
        teamId: 'team-1',
        category: 'auth' as const,
        page: 1,
        limit: 10,
      };

      (prisma.auditLog.findMany as jest.Mock).mockResolvedValue([mockAuditLog]);
      (prisma.auditLog.count as jest.Mock).mockResolvedValue(1);

      const result = await auditService.getLogs(filters);

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            teamId: filters.teamId,
            category: filters.category,
          }),
          skip: 0,
          take: filters.limit,
        })
      );

      expect(result).toEqual({
        logs: [mockAuditLog],
        pagination: {
          total: 1,
          pages: 1,
          page: 1,
          limit: 10,
        },
      });
    });

    it('should handle date filters correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      await auditService.getLogs({
        startDate,
        endDate,
      });

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          }),
        })
      );
    });
  });

  describe('exportLogs', () => {
    it('should export audit logs to CSV format', async () => {
      (prisma.auditLog.findMany as jest.Mock).mockResolvedValue([mockAuditLog]);

      const csv = await auditService.exportLogs({
        teamId: 'team-1',
      });

      expect(typeof csv).toBe('string');
      expect(csv).toContain('Timestamp,Action,Category,Status');
      expect(csv).toContain(mockAuditLog.action);
      expect(csv).toContain(mockAuditLog.category);
      expect(csv).toContain(mockAuditLog.status);
    });
  });

  describe('trackSessionActivity', () => {
    it('should update session last active timestamp', async () => {
      const sessionToken = 'session-token';
      await auditService.trackSessionActivity(sessionToken);

      expect(prisma.session.update).toHaveBeenCalledWith({
        where: { sessionToken },
        data: { lastActive: expect.any(Date) },
      });
    });

    it('should handle errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      (prisma.session.update as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await auditService.trackSessionActivity('session-token');

      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe('revokeSession', () => {
    it('should revoke a session', async () => {
      const sessionToken = 'session-token';
      await auditService.revokeSession(sessionToken);

      expect(prisma.session.update).toHaveBeenCalledWith({
        where: { sessionToken },
        data: { isRevoked: true },
      });
    });

    it('should handle errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      (prisma.session.update as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await auditService.revokeSession('session-token');

      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });
});

import { mockReset } from 'jest-mock-extended';
import { mockPrisma } from '../__mocks__/prisma';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
}));

import prisma from '@/lib/prisma';
import { AuditService } from '@/lib/boxyhq/audit-service';

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(() => {
    mockReset(mockPrisma);
    service = new AuditService();
  });

  describe('create', () => {
    it('should create an audit log entry', async () => {
      const mockAuditLog = {
        id: '1',
        teamId: 'team1',
        action: 'create',
        actor: { id: 'user1', name: 'Test User' },
        target: { id: 'resource1', type: 'document' },
        metadata: { key: 'value' },
        createdAt: new Date(),
      };

      mockPrisma.auditLog.create.mockResolvedValue(mockAuditLog);

      const result = await service.create({
        teamId: 'team1',
        action: 'create',
        actor: { id: 'user1', name: 'Test User' },
        target: { id: 'resource1', type: 'document' },
        metadata: { key: 'value' },
      });

      expect(result).toEqual(mockAuditLog);
      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
        data: {
          teamId: 'team1',
          action: 'create',
          actor: { id: 'user1', name: 'Test User' },
          target: { id: 'resource1', type: 'document' },
          metadata: { key: 'value' },
        },
      });
    });
  });

  describe('list', () => {
    it('should fetch audit logs with filters', async () => {
      const mockLogs = [
        {
          id: '1',
          teamId: 'team1',
          action: 'create',
          actor: { id: 'user1', name: 'Test User' },
          target: { id: 'resource1', type: 'document' },
          metadata: {},
          createdAt: new Date(),
        },
      ];

      mockPrisma.auditLog.findMany.mockResolvedValue(mockLogs);
      mockPrisma.auditLog.count.mockResolvedValue(1);

      const result = await service.list('team1', 1, 10);

      expect(result.logs).toEqual(mockLogs);
      expect(result.total).toBe(1);
      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith({
        where: { teamId: 'team1' },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should handle date filters correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      mockPrisma.auditLog.findMany.mockResolvedValue([]);
      mockPrisma.auditLog.count.mockResolvedValue(0);

      await service.list('team1', 1, 10, startDate, endDate);

      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith({
        where: {
          teamId: 'team1',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });
  });
});

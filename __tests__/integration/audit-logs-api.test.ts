import { createMocks } from 'node-mocks-http';
import { mockTeam, mockUser } from '../utils/test-utils';
import { mockReset } from 'jest-mock-extended';
import { mockPrisma } from '../__mocks__/prisma';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
}));

import handler from '@/pages/api/teams/[id]/audit-logs';

describe('Audit Logs API', () => {
  beforeEach(() => {
    mockReset(mockPrisma);
  });

  const mockAuditLog = {
    id: 'audit-1',
    action: 'created',
    actor: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
    },
    target: 'document',
    metadata: { name: 'test.doc' },
    teamId: mockTeam.id,
    createdAt: new Date(),
  };

  describe('GET /api/teams/[id]/audit-logs', () => {
    it('should return audit logs for authorized users', async () => {
      mockPrisma.teamMember.findFirst.mockResolvedValue({
        id: 'member-1',
        userId: mockUser.id,
        teamId: mockTeam.id,
        role: 'ADMIN',
      });

      mockPrisma.auditLog.findMany.mockResolvedValue([mockAuditLog]);
      mockPrisma.auditLog.count.mockResolvedValue(1);

      const { req, res } = createMocks({
        method: 'GET',
        query: {
          id: mockTeam.id,
        },
        headers: {
          'x-user-id': mockUser.id,
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      
      const data = JSON.parse(res._getData());
      expect(data.logs).toHaveLength(1);
      expect(data.total).toBe(1);
    });

    it('should handle insufficient permissions', async () => {
      mockPrisma.teamMember.findFirst.mockResolvedValue(null);

      const { req, res } = createMocks({
        method: 'GET',
        query: {
          id: mockTeam.id,
        },
        headers: {
          'x-user-id': mockUser.id,
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(403);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Insufficient permissions',
      });
    });

    it('should handle query parameters correctly', async () => {
      mockPrisma.teamMember.findFirst.mockResolvedValue({
        id: 'member-1',
        userId: mockUser.id,
        teamId: mockTeam.id,
        role: 'ADMIN',
      });

      mockPrisma.auditLog.findMany.mockResolvedValue([mockAuditLog]);
      mockPrisma.auditLog.count.mockResolvedValue(1);

      const { req, res } = createMocks({
        method: 'GET',
        query: {
          id: mockTeam.id,
          page: '2',
          perPage: '20',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
        },
        headers: {
          'x-user-id': mockUser.id,
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      
      const data = JSON.parse(res._getData());
      expect(data.logs).toHaveLength(1);
      expect(data.page).toBe(2);
      expect(data.perPage).toBe(20);
    });
  });
});

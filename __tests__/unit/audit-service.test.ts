import { mockTeam, mockUser, mockAuditLog } from '../utils/test-utils';
import { PrismaClient } from '@prisma/client';

// Mock Prisma
const mockPrisma = {
  auditLog: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
  },
};

jest.mock('../../lib/prisma', () => {
  return {
    __esModule: true,
    default: mockPrisma,
  };
});

// Import after mocking
const { AuditService, AuditLogCategory, AuditLogStatus, AuditLogAction } = require('../../lib/boxyhq/audit-service');

describe('AuditService', () => {
  let service: typeof AuditService;

  beforeEach(() => {
    service = AuditService.getInstance();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an audit log entry', async () => {
      const logData = {
        teamId: mockTeam.id,
        userId: mockUser.id,
        action: 'TEAM_MEMBER_ADDED' as typeof AuditLogAction,
        category: AuditLogCategory.TEAM,
        status: AuditLogStatus.SUCCESS,
        metadata: { role: 'ADMIN' },
      };

      mockPrisma.auditLog.create.mockResolvedValue(mockAuditLog);

      const result = await service.create(logData);

      expect(result).toEqual(mockAuditLog);
      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
        data: logData,
      });
    });
  });

  describe('get', () => {
    it('should fetch a single audit log by id', async () => {
      mockPrisma.auditLog.findUnique.mockResolvedValue(mockAuditLog);

      const result = await service.get(mockAuditLog.id);

      expect(result).toEqual(mockAuditLog);
      expect(mockPrisma.auditLog.findUnique).toHaveBeenCalledWith({
        where: { id: mockAuditLog.id },
        include: {
          user: true,
          team: true,
        },
      });
    });
  });

  describe('list', () => {
    it('should fetch audit logs with filters', async () => {
      const filters = {
        teamId: mockTeam.id,
        category: AuditLogCategory.TEAM,
        status: AuditLogStatus.SUCCESS,
      };

      mockPrisma.auditLog.findMany.mockResolvedValue([mockAuditLog]);
      mockPrisma.auditLog.count.mockResolvedValue(1);

      const result = await service.list(filters);

      expect(result).toEqual({
        logs: [mockAuditLog],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
        },
      });
      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith({
        where: {
          teamId: mockTeam.id,
          category: 'TEAM',
          status: 'SUCCESS',
        },
        include: {
          user: true,
          team: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        skip: 0,
      });
    });

    it('should handle date filters correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      mockPrisma.auditLog.findMany.mockResolvedValue([mockAuditLog]);
      mockPrisma.auditLog.count.mockResolvedValue(1);

      const result = await service.list({
        teamId: mockTeam.id,
        startDate,
        endDate,
      });

      expect(result).toEqual({
        logs: [mockAuditLog],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
        },
      });
      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith({
        where: {
          teamId: mockTeam.id,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          user: true,
          team: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        skip: 0,
      });
    });
  });
});

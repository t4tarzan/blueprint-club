import { prisma } from '../prisma';

export interface AuditLogData {
  action: string;
  actorId: string;
  actorEmail?: string;
  targetType: string;
  targetId: string;
  teamId?: string;
  metadata?: Record<string, any>;
}

export class AuditService {
  private static instance: AuditService;

  private constructor() {}

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  async log(data: AuditLogData) {
    try {
      const { action, actorId, actorEmail, targetType, targetId, teamId, metadata } = data;

      await prisma.auditLog.create({
        data: {
          action,
          actorId,
          actorEmail,
          targetType,
          targetId,
          teamId,
          metadata,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Error creating audit log:', error);
      throw error;
    }
  }

  async getTeamAuditLogs(teamId: string, options?: {
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    actions?: string[];
    targetTypes?: string[];
  }) {
    try {
      const {
        startDate,
        endDate,
        page = 1,
        limit = 50,
        actions,
        targetTypes,
      } = options || {};

      const where = {
        teamId,
        ...(startDate && endDate && {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        }),
        ...(actions?.length && {
          action: {
            in: actions,
          },
        }),
        ...(targetTypes?.length && {
          targetType: {
            in: targetTypes,
          },
        }),
      };

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          orderBy: {
            timestamp: 'desc',
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            actor: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
          },
        }),
        prisma.auditLog.count({ where }),
      ]);

      return {
        logs,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit,
        },
      };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  async getUserAuditLogs(userId: string, options?: {
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    actions?: string[];
  }) {
    try {
      const {
        startDate,
        endDate,
        page = 1,
        limit = 50,
        actions,
      } = options || {};

      const where = {
        actorId: userId,
        ...(startDate && endDate && {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        }),
        ...(actions?.length && {
          action: {
            in: actions,
          },
        }),
      };

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          orderBy: {
            timestamp: 'desc',
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            actor: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
          },
        }),
        prisma.auditLog.count({ where }),
      ]);

      return {
        logs,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit,
        },
      };
    } catch (error) {
      console.error('Error fetching user audit logs:', error);
      throw error;
    }
  }
}

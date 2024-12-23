import { AuditLog, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { SerializedAuditLog } from '@/lib/types/prisma';

export enum AuditLogCategory {
  TEAM = 'TEAM',
  AUTH = 'AUTH',
  PROGRAM = 'PROGRAM',
  SETTINGS = 'SETTINGS',
  BILLING = 'BILLING',
}

export enum AuditLogStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PENDING = 'PENDING',
}

export enum AuditLogAction {
  TEAM_MEMBER_ADDED = 'TEAM_MEMBER_ADDED',
  TEAM_MEMBER_REMOVED = 'TEAM_MEMBER_REMOVED',
  TEAM_MEMBER_ROLE_UPDATED = 'TEAM_MEMBER_ROLE_UPDATED',
  TEAM_SETTINGS_UPDATED = 'TEAM_SETTINGS_UPDATED',
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_REGISTERED = 'USER_REGISTERED',
  USER_PASSWORD_RESET = 'USER_PASSWORD_RESET',
  PROGRAM_CREATED = 'PROGRAM_CREATED',
  PROGRAM_UPDATED = 'PROGRAM_UPDATED',
  PROGRAM_DELETED = 'PROGRAM_DELETED',
  BILLING_SUBSCRIPTION_UPDATED = 'BILLING_SUBSCRIPTION_UPDATED',
  BILLING_PAYMENT_PROCESSED = 'BILLING_PAYMENT_PROCESSED',
}

export type AuditLogData = {
  action: string;
  actor: {
    id: string;
    email: string;
    name?: string | null;
  };
  target: {
    id: string | null;
    type: string;
    name?: string | null;
  };
  metadata?: Record<string, any> | null;
};

export class AuditService {
  private static instance: AuditService;

  private constructor() {}

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  async create(
    teamId: string,
    data: AuditLogData
  ): Promise<AuditLog> {
    const { action, actor, target, metadata } = data;

    const auditLog = await prisma.auditLog.create({
      data: {
        teamId,
        action,
        actorId: actor.id,
        actorEmail: actor.email,
        actorName: actor.name || null,
        entityId: target.id,
        entityType: target.type,
        entityName: target.name || null,
        metadata: metadata ? (metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return auditLog;
  }

  async findByTeam(
    teamId: string,
    options: {
      page?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<{
    logs: SerializedAuditLog[];
    totalPages: number;
    currentPage: number;
  }> {
    const { page = 1, limit = 10, startDate, endDate } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {
      teamId,
      ...(startDate && { createdAt: { gte: new Date(startDate) } }),
      ...(endDate && { createdAt: { lte: new Date(endDate) } }),
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      logs: logs.map((log) => ({
        id: log.id,
        teamId: log.teamId,
        action: log.action,
        actorId: log.actorId,
        actorEmail: log.actorEmail,
        actorName: log.actorName,
        entityId: log.entityId,
        entityType: log.entityType,
        entityName: log.entityName,
        metadata: log.metadata,
        createdAt: log.createdAt.toISOString(),
        updatedAt: log.createdAt.toISOString(), // AuditLog doesn't have updatedAt, use createdAt
        team: log.team ? {
          id: log.team.id,
          name: log.team.name,
        } : null,
      })),
      totalPages,
      currentPage: page,
    };
  }

  async findById(id: string): Promise<AuditLog | null> {
    const log = await prisma.auditLog.findUnique({
      where: { id },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return log;
  }

  async findByTeamAndAction(
    teamId: string,
    action?: string,
    startDate?: string,
    endDate?: string
  ): Promise<AuditLog[]> {
    const where: Prisma.AuditLogWhereInput = {
      teamId,
      ...(action && { action }),
      ...(startDate && { createdAt: { gte: new Date(startDate) } }),
      ...(endDate && { createdAt: { lte: new Date(endDate) } }),
    };

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return logs;
  }

  async list(teamId: string, page: number = 1, perPage: number = 10) {
    const logs = await prisma.auditLog.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const total = await prisma.auditLog.count({
      where: { teamId },
    });

    return {
      logs,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }
}

export default AuditService;

import { prisma } from '@/lib/prisma';
import { AuditLog, Prisma } from '@prisma/client';

export interface AuditLogOptions {
  teamId?: string;
  action: string;
  entityId?: string;
  entityType: string;
  entityName?: string;
  actorId: string;
  actorEmail: string;
  actorName?: string;
  metadata?: Record<string, unknown>;
}

export class AuditService {
  async create(options: AuditLogOptions): Promise<AuditLog> {
    const {
      teamId,
      action,
      entityId,
      entityType,
      entityName,
      actorId,
      actorEmail,
      actorName,
      metadata,
    } = options;

    return prisma.auditLog.create({
      data: {
        teamId,
        action,
        entityId,
        entityType,
        entityName,
        actorId,
        actorEmail,
        actorName,
        metadata: metadata as Prisma.JsonObject,
      },
    });
  }

  async findMany(options: {
    teamId?: string;
    page?: number;
    limit?: number;
    orderBy?: Prisma.AuditLogOrderByWithRelationInput;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    const { teamId, page = 1, limit = 10, orderBy } = options;

    const where: Prisma.AuditLogWhereInput = {};

    if (teamId) {
      where.teamId = teamId;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  }

  async findById(id: string): Promise<AuditLog | null> {
    return prisma.auditLog.findUnique({
      where: { id },
    });
  }
}

import { prisma } from '../prisma';
import { getClientIp } from 'request-ip';
import { NextApiRequest } from 'next';

export type AuditLogCategory =
  | 'auth'
  | 'team'
  | 'member'
  | 'sso'
  | 'scim'
  | 'api'
  | 'security';

export type AuditLogAction =
  | 'user.login'
  | 'user.logout'
  | 'user.failed_login'
  | 'team.create'
  | 'team.update'
  | 'team.delete'
  | 'member.add'
  | 'member.remove'
  | 'member.update'
  | 'sso.configure'
  | 'sso.update'
  | 'sso.delete'
  | 'scim.enable'
  | 'scim.disable'
  | 'scim.token_regenerate'
  | 'api.key_create'
  | 'api.key_delete';

export type AuditLogStatus = 'success' | 'failure';

interface AuditLogData {
  teamId?: string;
  userId?: string;
  action: AuditLogAction;
  category: AuditLogCategory;
  status: AuditLogStatus;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
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

  /**
   * Create an audit log entry
   */
  public async log(data: AuditLogData) {
    try {
      await prisma.auditLog.create({
        data: {
          teamId: data.teamId,
          userId: data.userId,
          action: data.action,
          category: data.category,
          status: data.status,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          metadata: data.metadata || {},
        },
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  /**
   * Get audit logs with filtering and pagination
   */
  public async getLogs({
    teamId,
    userId,
    category,
    action,
    status,
    startDate,
    endDate,
    page = 1,
    limit = 50,
  }: {
    teamId?: string;
    userId?: string;
    category?: AuditLogCategory;
    action?: AuditLogAction;
    status?: AuditLogStatus;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (teamId) where.teamId = teamId;
    if (userId) where.userId = userId;
    if (category) where.category = category;
    if (action) where.action = action;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
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
  }

  /**
   * Export audit logs to CSV
   */
  public async exportLogs({
    teamId,
    startDate,
    endDate,
  }: {
    teamId: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = { teamId };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert logs to CSV format
    const headers = [
      'Timestamp',
      'Action',
      'Category',
      'Status',
      'User',
      'IP Address',
      'User Agent',
      'Additional Details',
    ];

    const rows = logs.map((log) => [
      log.createdAt.toISOString(),
      log.action,
      log.category,
      log.status,
      log.user ? `${log.user.name} (${log.user.email})` : 'System',
      log.ipAddress || '',
      log.userAgent || '',
      JSON.stringify(log.metadata || {}),
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
  }

  /**
   * Get request metadata for audit logging
   */
  public getRequestMetadata(req: NextApiRequest) {
    return {
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
    };
  }

  /**
   * Track user session activity
   */
  public async trackSessionActivity(sessionToken: string) {
    try {
      await prisma.session.update({
        where: { sessionToken },
        data: { lastActive: new Date() },
      });
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }

  /**
   * Revoke user session
   */
  public async revokeSession(sessionToken: string) {
    try {
      await prisma.session.update({
        where: { sessionToken },
        data: { isRevoked: true },
      });
    } catch (error) {
      console.error('Failed to revoke session:', error);
    }
  }
}

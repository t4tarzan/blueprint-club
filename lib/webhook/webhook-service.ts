import { prisma } from '../prisma';
import crypto from 'crypto';
import { AuditService } from '../boxyhq/audit-service';

export interface WebhookPayload {
  event: string;
  data: any;
  teamId: string;
  timestamp: string;
}

export class WebhookService {
  private static instance: WebhookService;
  private auditService: AuditService;

  private constructor() {
    this.auditService = AuditService.getInstance();
  }

  public static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  async createWebhook(teamId: string, userId: string, data: {
    url: string;
    description?: string;
    events: string[];
    isActive?: boolean;
  }) {
    const secret = crypto.randomBytes(32).toString('hex');

    const webhook = await prisma.webhook.create({
      data: {
        teamId,
        url: data.url,
        description: data.description,
        events: data.events,
        secret,
        isActive: data.isActive ?? true,
      },
    });

    await this.auditService.log({
      teamId,
      userId,
      action: 'webhook.create',
      category: 'api',
      status: 'success',
      metadata: {
        webhookId: webhook.id,
        url: webhook.url,
        events: webhook.events,
      },
    });

    return webhook;
  }

  async updateWebhook(teamId: string, webhookId: string, userId: string, data: {
    url?: string;
    description?: string;
    events?: string[];
    isActive?: boolean;
  }) {
    const webhook = await prisma.webhook.update({
      where: {
        id: webhookId,
        teamId,
      },
      data,
    });

    await this.auditService.log({
      teamId,
      userId,
      action: 'webhook.update',
      category: 'api',
      status: 'success',
      metadata: {
        webhookId: webhook.id,
        updates: data,
      },
    });

    return webhook;
  }

  async deleteWebhook(teamId: string, webhookId: string, userId: string) {
    await prisma.webhook.delete({
      where: {
        id: webhookId,
        teamId,
      },
    });

    await this.auditService.log({
      teamId,
      userId,
      action: 'webhook.delete',
      category: 'api',
      status: 'success',
      metadata: {
        webhookId,
      },
    });
  }

  async getWebhook(teamId: string, webhookId: string) {
    return prisma.webhook.findUnique({
      where: {
        id: webhookId,
        teamId,
      },
    });
  }

  async listWebhooks(teamId: string) {
    return prisma.webhook.findMany({
      where: {
        teamId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async sendWebhook(teamId: string, event: string, data: any) {
    const webhooks = await prisma.webhook.findMany({
      where: {
        teamId,
        isActive: true,
        events: {
          has: event,
        },
      },
    });

    const payload: WebhookPayload = {
      event,
      data,
      teamId,
      timestamp: new Date().toISOString(),
    };

    const deliveryPromises = webhooks.map(async (webhook) => {
      const signature = this.generateSignature(webhook.secret, payload);

      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Blueprint-Signature': signature,
            'X-Blueprint-Event': event,
            'X-Blueprint-Delivery': crypto.randomBytes(16).toString('hex'),
          },
          body: JSON.stringify(payload),
        });

        const success = response.ok;
        const statusCode = response.status;

        await prisma.webhookDelivery.create({
          data: {
            webhookId: webhook.id,
            event,
            payload: payload as any,
            statusCode,
            success,
            error: !success ? await response.text() : null,
          },
        });

        return {
          webhookId: webhook.id,
          success,
          statusCode,
        };
      } catch (error: any) {
        await prisma.webhookDelivery.create({
          data: {
            webhookId: webhook.id,
            event,
            payload: payload as any,
            statusCode: 0,
            success: false,
            error: error.message,
          },
        });

        return {
          webhookId: webhook.id,
          success: false,
          error: error.message,
        };
      }
    });

    return Promise.all(deliveryPromises);
  }

  async getWebhookDeliveries(teamId: string, webhookId: string, options?: {
    page?: number;
    limit?: number;
    status?: 'success' | 'failure';
  }) {
    const {
      page = 1,
      limit = 50,
      status,
    } = options || {};

    const where = {
      webhook: {
        teamId,
        id: webhookId,
      },
      ...(status && {
        success: status === 'success',
      }),
    };

    const [deliveries, total] = await Promise.all([
      prisma.webhookDelivery.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          webhook: {
            select: {
              url: true,
              events: true,
            },
          },
        },
      }),
      prisma.webhookDelivery.count({ where }),
    ]);

    return {
      deliveries,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  private generateSignature(secret: string, payload: WebhookPayload): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }
}

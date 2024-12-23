import { Prisma, Webhook, WebhookDelivery } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import axios, { AxiosResponse, AxiosError } from 'axios';
import crypto from 'crypto';

interface WebhookResponse {
  status: number;
  data?: any;
  headers?: Record<string, string>;
}

interface WebhookEvent {
  type: string;
  data: Record<string, unknown>;
}

interface WebhookDeliveryData {
  webhookId: string;
  eventType: string;
  requestBody: Record<string, unknown>;
  requestHeaders: Record<string, string>;
  responseBody?: Record<string, unknown>;
  responseHeaders?: Record<string, string>;
  responseStatus?: number;
}

export class WebhookService {
  private static instance: WebhookService;

  private constructor() {}

  static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  async createWebhook(data: {
    teamId: string;
    url: string;
    description?: string;
    events: string[];
    secret?: string;
    isActive?: boolean;
  }): Promise<Webhook> {
    return prisma.webhook.create({
      data: {
        teamId: data.teamId,
        url: data.url,
        name: data.description || data.url,
        description: data.description,
        events: data.events,
        secret: data.secret,
        isActive: data.isActive ?? true,
      },
    });
  }

  async updateWebhook(
    id: string,
    data: {
      url?: string;
      description?: string;
      events?: string[];
      secret?: string;
      isActive?: boolean;
    }
  ): Promise<Webhook> {
    return prisma.webhook.update({
      where: { id },
      data,
    });
  }

  async deleteWebhook(id: string): Promise<void> {
    await prisma.webhook.delete({
      where: { id },
    });
  }

  async getWebhook(id: string): Promise<Webhook | null> {
    return prisma.webhook.findUnique({
      where: { id },
    });
  }

  async getWebhooks(teamId: string): Promise<Webhook[]> {
    return prisma.webhook.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(webhookId: string): Promise<Webhook | null> {
    return prisma.webhook.findUnique({
      where: { id: webhookId }
    });
  }

  async update(webhookId: string, data: Partial<Webhook>): Promise<Webhook> {
    return prisma.webhook.update({
      where: { id: webhookId },
      data
    });
  }

  async delete(webhookId: string): Promise<void> {
    await prisma.webhook.delete({
      where: { id: webhookId }
    });
  }

  async listDeliveries(webhookId: string, page: number = 1): Promise<WebhookDelivery[]> {
    const perPage = 10;
    return prisma.webhookDelivery.findMany({
      where: { webhookId },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' }
    });
  }

  async createDelivery(
    webhookId: string,
    eventType: string,
    payload: Record<string, any>,
    response?: WebhookResponse,
    error?: Error | AxiosError,
    success: boolean = true
  ): Promise<WebhookDelivery> {
    const startTime = Date.now();
    const endTime = Date.now();
    const duration = endTime - startTime;

    const webhook = await prisma.webhook.findUnique({
      where: { id: webhookId },
    });

    if (!webhook) {
      throw new Error('Webhook not found');
    }

    const webhookDelivery = await prisma.webhookDelivery.create({
      data: {
        webhookId,
        eventType,
        event: eventType,
        url: webhook.url,
        success,
        requestBody: payload as Prisma.JsonObject,
        requestHeaders: {
          'Content-Type': 'application/json',
          'X-Webhook-ID': webhookId,
          'X-Event-Type': eventType,
        } as Prisma.JsonObject,
        responseBody: (response?.data || {}) as Prisma.JsonObject,
        responseHeaders: (response?.headers || {}) as Prisma.JsonObject,
        statusCode: response?.status ?? 500,
        duration,
        error: error ? error.message : null,
      },
    });

    return webhookDelivery;
  }

  async sendWebhook(webhookId: string, event: { type: string; data: any }): Promise<WebhookResponse> {
    const webhook = await prisma.webhook.findUnique({
      where: { id: webhookId },
    });

    if (!webhook) {
      throw new Error('Webhook not found');
    }

    if (!webhook.isActive) {
      throw new Error('Webhook is not active');
    }

    if (!webhook.events.includes(event.type)) {
      throw new Error('Event not registered for this webhook');
    }

    const requestHeaders = {
      'Content-Type': 'application/json',
      'X-Webhook-ID': webhook.id,
      'X-Event-Type': event.type,
      'X-Webhook-Signature': webhook.secret ? 
        crypto
          .createHmac('sha256', webhook.secret)
          .update(JSON.stringify(event.data))
          .digest('hex')
        : undefined,
    };

    const startTime = Date.now();
    let response: WebhookResponse | undefined;
    let error: Error | AxiosError | undefined;

    try {
      const axiosResponse = await axios.post(webhook.url, event.data, {
        headers: requestHeaders,
        timeout: 10000,
      });

      response = {
        status: axiosResponse.status,
        data: axiosResponse.data,
        headers: Object.fromEntries(
          Object.entries(axiosResponse.headers).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.join(', ') : String(value),
          ])
        ),
      };
    } catch (err) {
      error = err as Error | AxiosError;
      response = {
        status: 500,
        data: {},
        headers: {},
      };
    }

    await this.createDelivery(
      webhook.id,
      event.type,
      event.data,
      response,
      error,
      !error
    );

    if (error) {
      throw error;
    }

    return response;
  }

  async getWebhookDeliveries(
    webhookId: string,
    page = 1,
    limit = 10
  ): Promise<{
    deliveries: WebhookDelivery[];
    total: number;
  }> {
    const [deliveries, total] = await Promise.all([
      prisma.webhookDelivery.findMany({
        where: { webhookId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.webhookDelivery.count({
        where: { webhookId },
      }),
    ]);

    return {
      deliveries,
      total,
    };
  }

  async findByTeam(teamId: string): Promise<Array<Webhook & { name: string }>> {
    const webhooks = await prisma.webhook.findMany({
      where: {
        teamId,
      },
    });

    return webhooks.map(webhook => ({
      ...webhook,
      name: webhook.description || webhook.url,
    }));
  }

  async create(data: {
    name: string;
    url: string;
    description?: string;
    events: string[];
    isActive: boolean;
    teamId: string;
  }): Promise<Webhook> {
    return prisma.webhook.create({
      data: {
        name: data.name,
        url: data.url,
        description: data.description || null,
        events: data.events,
        isActive: data.isActive,
        teamId: data.teamId,
        secret: crypto.randomBytes(32).toString('hex'),
      },
    });
  }

  private signPayload(secret: string, payload: string): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    return hmac.digest('hex');
  }
}

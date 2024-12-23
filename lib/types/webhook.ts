import { Webhook as PrismaWebhook, WebhookDelivery as PrismaWebhookDelivery } from '@prisma/client';

export interface Webhook extends PrismaWebhook {
  deliveries?: WebhookDelivery[];
}

export interface WebhookDelivery extends PrismaWebhookDelivery {
  webhook?: Webhook;
}

export type WebhookEvent = 'team.created' | 'team.updated' | 'team.deleted' |
  'member.added' | 'member.removed' | 'member.updated';

export interface WebhookFormData {
  url: string;
  description?: string;
  events: WebhookEvent[];
  isActive: boolean;
  secret?: string;
}

export interface WebhookDeliveryData {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  payload: any;
  statusCode: number;
  success: boolean;
  error?: string;
  createdAt: Date;
}

export interface WebhookFormProps {
  webhook?: Webhook;
  onSubmit: (data: WebhookFormData) => Promise<void>;
  onCancel?: () => void;
  events: WebhookEvent[];
}

export interface WebhookListProps {
  webhooks: Webhook[];
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, enabled: boolean) => Promise<void>;
}

export interface WebhookDeliveryListProps {
  webhookId: string;
  onRetry?: (id: string) => Promise<void>;
}

export interface WebhookDeliveryDetailsProps {
  delivery: WebhookDelivery;
  onClose: () => void;
}

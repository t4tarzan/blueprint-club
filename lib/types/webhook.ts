export interface WebhookEvent {
  id: string;
  name: string;
  description: string;
}

export interface WebhookFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  events: WebhookEvent[];
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  url: string;
  event: string;
  requestBody: any;
  responseBody: any;
  responseStatus: number;
  error?: string;
  createdAt: Date;
}

export interface WebhookListProps {
  webhooks: Webhook[];
  onDelete: (id: string) => Promise<void>;
}

export type AuditLogAction =
  | 'webhook.create'
  | 'webhook.update'
  | 'webhook.delete'
  | 'team.create'
  | 'team.update'
  | 'team.delete'
  | 'user.create'
  | 'user.update'
  | 'user.delete';

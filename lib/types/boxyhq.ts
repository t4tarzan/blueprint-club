import { Role, Team, TeamMember, User, Invitation } from '@prisma/client';

export interface BoxyHQSAMLProfile {
  id: string;
  email: string;
  name: string;
  provider: string;
}

export interface BoxyHQSAMLConfig {
  clientID: string;
  clientSecret: string;
  issuer: string;
  callback: string;
}

export interface SAMLResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export interface SCIMUser {
  id: string;
  userName: string;
  name: {
    givenName: string;
    familyName: string;
  };
  emails: Array<{ value: string; type: string; primary: boolean }>;
  active: boolean;
}

export interface SCIMGroup {
  id: string;
  displayName: string;
  members: Array<{ value: string }>;
}

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

export { Role, Team, TeamMember, User, Invitation };

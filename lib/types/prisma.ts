import type { Prisma, PrismaClient } from '@prisma/client';

// Export Prisma namespace for access to enums and types
export type { Prisma };

// Re-export types from Prisma
export type {
  User,
  Team,
  TeamMember,
  Invitation,
  AuditLog,
  Webhook,
  WebhookDelivery,
} from '@prisma/client';

// Custom type for team with members
export type TeamWithMembers = Prisma.TeamGetPayload<{
  include: {
    members: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            image: true;
          };
        };
      };
    };
  };
}>;

// Custom type for webhook with deliveries
export type WebhookWithDeliveries = Prisma.WebhookGetPayload<{
  include: {
    deliveries: true;
  };
}>;

// Custom type for user with teams
export type UserWithTeams = Prisma.UserGetPayload<{
  include: {
    teams: {
      include: {
        team: true;
      };
    };
  };
}>;

// Custom type for invitation with team
export type InvitationWithTeam = Prisma.InvitationGetPayload<{
  include: {
    team: true;
  };
}>;

// Custom type for webhook delivery with webhook
export type WebhookDeliveryWithWebhook = Prisma.WebhookDeliveryGetPayload<{
  include: {
    webhook: true;
  };
}>;

// Export Role type
export type Role = 'OWNER' | 'ADMIN' | 'MEMBER';

// Input types
export interface CreateTeamInput {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  features?: string[];
}

export interface UpdateTeamInput {
  name?: string;
  description?: string;
  image?: string;
  features?: string[];
}

// Subscription types
export enum AuditLogCategory {
  AUTH = 'AUTH',
  TEAM = 'TEAM',
  BILLING = 'BILLING',
  WEBHOOK = 'WEBHOOK',
  INTEGRATION = 'INTEGRATION',
}

export enum AuditLogStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PENDING = 'PENDING',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  TRIALING = 'TRIALING',
}

export type PrismaClientWithExtensions = PrismaClient;

export type PrismaTransactionClient = Omit<
  Prisma.TransactionClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;

// Custom types for serialized data
export interface SerializedUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: string | null;
  membershipTier: string;
  teams: {
    id: string;
    name: string;
    slug: string;
    role: Role;
  }[];
}

export interface SerializedTeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

export interface SerializedTeam {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  members: SerializedTeamMember[];
}

export interface SerializedInvitation {
  id: string;
  email: string;
  role: Role;
  token: string;
  teamId: string;
  expires: string;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedAuditLog {
  id: string;
  teamId: string | null;
  action: string;
  actorId: string;
  actorEmail: string;
  actorName: string | null;
  entityId: string | null;
  entityType: string;
  entityName: string | null;
  metadata: Prisma.JsonValue;
  createdAt: string;
  updatedAt: string;
  team: {
    id: string;
    name: string;
  } | null;
}

export interface SerializedWebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  url: string;
  requestBody: Prisma.JsonValue;
  requestHeaders: Prisma.JsonValue;
  responseBody: Prisma.JsonValue;
  responseHeaders: Prisma.JsonValue;
  statusCode: number;
  success: boolean;
  duration: number;
  error: string | null;
  createdAt: string;
  updatedAt: string;
  webhook?: {
    id: string;
    url: string;
  } | null;
}

export interface SerializedSubscription {
  id: string;
  userId: string;
  teamId: string | null;
  planId: string;
  stripeId: string;
  priceId: string;
  quantity: number;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  usages: SerializedSubscriptionUsage[];
}

export interface SerializedSubscriptionUsage {
  id: string;
  subscriptionId: string;
  teamId: string;
  metric: string;
  feature: string;
  value: number;
  limit: number;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseError extends Error {
  code?: string;
}

export type WithSerializedDates<T> = {
  [P in keyof T]: T[P] extends Date
    ? string
    : T[P] extends Date | null
    ? string | null
    : T[P] extends object
    ? WithSerializedDates<T[P]>
    : T[P];
};

export type SubscriptionWithUsage = {
  id: string;
  userId: string;
  teamId: string | null;
  planId: string;
  stripeId: string;
  priceId: string;
  quantity: number;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  usage: {
    [key: string]: number;
  };
};

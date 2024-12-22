import { SubscriptionStatus } from '@prisma/client';
import prisma from './prisma';

export interface SubscriptionPlan {
  name: string;
  maxTeamMembers: number;
  features: string[];
  priceId: string;
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  starter: {
    name: 'Starter',
    maxTeamMembers: 5,
    features: ['Basic features', 'Email support', 'Team collaboration'],
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!,
  },
  pro: {
    name: 'Pro',
    maxTeamMembers: 20,
    features: [
      'All Starter features',
      'Priority support',
      'Advanced analytics',
      'Custom branding',
      'API access',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
  },
  enterprise: {
    name: 'Enterprise',
    maxTeamMembers: Infinity,
    features: [
      'All Pro features',
      'Unlimited team members',
      'Enterprise SSO',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantees',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID!,
  },
};

export async function getUserSubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function checkSubscriptionAccess(userId: string, feature: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return false;

  const plan = Object.values(SUBSCRIPTION_PLANS).find(
    (p) => p.priceId === subscription.priceId
  );
  if (!plan) return false;

  return plan.features.some((f) => f.toLowerCase().includes(feature.toLowerCase()));
}

export async function checkTeamMemberLimit(userId: string): Promise<{
  allowed: boolean;
  limit: number;
  current: number;
}> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) {
    return { allowed: false, limit: 0, current: 0 };
  }

  const plan = Object.values(SUBSCRIPTION_PLANS).find(
    (p) => p.priceId === subscription.priceId
  );
  if (!plan) {
    return { allowed: false, limit: 0, current: 0 };
  }

  const teamMembersCount = await prisma.teamMember.count({
    where: {
      team: {
        createdById: userId,
      },
    },
  });

  return {
    allowed: teamMembersCount < plan.maxTeamMembers,
    limit: plan.maxTeamMembers,
    current: teamMembersCount,
  };
}

export async function recordUsage(subscriptionId: string, quantity: number, description?: string) {
  return prisma.usageRecord.create({
    data: {
      subscriptionId,
      quantity,
      description,
    },
  });
}

export async function getSubscriptionUsage(subscriptionId: string, period?: {
  start: Date;
  end: Date;
}) {
  const where = {
    subscriptionId,
    ...(period && {
      timestamp: {
        gte: period.start,
        lte: period.end,
      },
    }),
  };

  const records = await prisma.usageRecord.findMany({
    where,
    orderBy: {
      timestamp: 'desc',
    },
  });

  const total = records.reduce((sum, record) => sum + record.quantity, 0);

  return {
    records,
    total,
  };
}

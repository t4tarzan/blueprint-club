import { prisma } from '@/lib/prisma';
import { Prisma, SubscriptionStatus } from '@prisma/client';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string;
  maxTeamMembers: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    users: number;
    storage: number;
    apiCalls: number;
  };
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'For small teams just getting started',
    price: 0,
    priceId: 'price_free',
    maxTeamMembers: 5,
    interval: 'month',
    features: ['Up to 5 team members', '5GB storage', '1000 API calls/month'],
    limits: {
      users: 5,
      storage: 5 * 1024 * 1024 * 1024, // 5GB in bytes
      apiCalls: 1000,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams with advanced needs',
    price: 49,
    priceId: 'price_pro',
    maxTeamMembers: 20,
    interval: 'month',
    features: ['Up to 20 team members', '50GB storage', '10000 API calls/month', 'Priority support'],
    limits: {
      users: 20,
      storage: 50 * 1024 * 1024 * 1024, // 50GB in bytes
      apiCalls: 10000,
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom requirements',
    price: 199,
    priceId: 'price_enterprise',
    maxTeamMembers: 999999,
    interval: 'month',
    features: ['Unlimited team members', 'Unlimited storage', 'Unlimited API calls', '24/7 support', 'Custom integrations'],
    limits: {
      users: 999999,
      storage: Number.MAX_SAFE_INTEGER,
      apiCalls: Number.MAX_SAFE_INTEGER,
    },
  },
};

export interface SubscriptionWithUsage extends Omit<Prisma.SubscriptionGetPayload<{ include: { usages: true } }>, 'usages'> {
  usages: Array<Prisma.SubscriptionUsageGetPayload<{}>>;
}

export class SubscriptionService {
  private static instance: SubscriptionService;

  private constructor() {}

  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  async createSubscription(data: {
    userId: string;
    teamId?: string;
    planId: string;
    stripeId: string;
    priceId: string;
    quantity: number;
    status?: SubscriptionStatus;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  }): Promise<SubscriptionWithUsage> {
    const subscription = await prisma.subscription.create({
      data: {
        userId: data.userId,
        teamId: data.teamId,
        planId: data.planId,
        stripeId: data.stripeId,
        priceId: data.priceId,
        quantity: data.quantity,
        status: data.status || SubscriptionStatus.ACTIVE,
        currentPeriodStart: data.currentPeriodStart || new Date(),
        currentPeriodEnd: data.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
      },
      include: {
        usages: true,
      },
    });

    return subscription;
  }

  async getSubscription(id: string): Promise<SubscriptionWithUsage | null> {
    return prisma.subscription.findUnique({
      where: { id },
      include: {
        usages: true,
      },
    });
  }

  async getUserSubscription(userId: string): Promise<SubscriptionWithUsage | null> {
    return prisma.subscription.findFirst({
      where: { userId },
      include: {
        usages: true,
      },
    });
  }

  async getTeamSubscription(teamId: string): Promise<SubscriptionWithUsage | null> {
    return prisma.subscription.findFirst({
      where: { teamId },
      include: {
        usages: true,
      },
    });
  }

  async updateSubscription(
    id: string,
    data: {
      status?: SubscriptionStatus;
      priceId?: string;
      quantity?: number;
      currentPeriodEnd?: Date;
      cancelAtPeriodEnd?: boolean;
    }
  ): Promise<SubscriptionWithUsage> {
    return prisma.subscription.update({
      where: { id },
      data: {
        status: data.status,
        priceId: data.priceId,
        quantity: data.quantity,
        currentPeriodEnd: data.currentPeriodEnd,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
      },
      include: {
        usages: true,
      },
    });
  }

  async recordUsage(data: {
    subscriptionId: string;
    teamId: string;
    metric: string;
    feature: string;
    value: number;
    limit: number;
  }): Promise<Prisma.SubscriptionUsageGetPayload<{}>> {
    return prisma.subscriptionUsage.create({
      data: {
        subscriptionId: data.subscriptionId,
        teamId: data.teamId,
        metric: data.metric,
        feature: data.feature,
        value: data.value,
        limit: data.limit,
      },
    });
  }

  async getTotalUsage(subscriptionId: string, metric: string): Promise<number> {
    const result = await prisma.subscriptionUsage.aggregate({
      where: {
        subscriptionId,
        metric,
      },
      _sum: {
        value: true,
      },
    });

    return result._sum.value || 0;
  }

  async getUsageByPeriod(
    subscriptionId: string,
    metric: string,
    startDate: Date,
    endDate: Date
  ): Promise<Prisma.SubscriptionUsageGetPayload<{}>[]> {
    return prisma.subscriptionUsage.findMany({
      where: {
        subscriptionId,
        metric,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async checkTeamMemberLimit(teamId: string): Promise<boolean> {
    const subscription = await this.getTeamSubscription(teamId);
    if (!subscription) {
      return false;
    }

    const teamMemberCount = await prisma.teamMember.count({
      where: { teamId },
    });

    const plan = SUBSCRIPTION_PLANS[subscription.planId];
    if (!plan) {
      return false;
    }

    return teamMemberCount < plan.maxTeamMembers;
  }
}

export const subscriptionService = SubscriptionService.getInstance();

export const checkTeamMemberLimit = async (teamId: string): Promise<boolean> => {
  return subscriptionService.checkTeamMemberLimit(teamId);
};

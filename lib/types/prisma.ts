import { Prisma } from '@prisma/client';

export type Role = 'OWNER' | 'ADMIN' | 'MEMBER';

export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED';

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: Date | null;
  membershipTier?: string;
  teams?: Array<{
    id: string;
    name: string;
    role: Role;
  }>;
  currentTeam?: any;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  team?: Team;
  user?: User;
}

export interface Invitation {
  id: string;
  teamId: string;
  email: string;
  role: Role;
  token: string;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
  team?: Team;
}

export type { Prisma };

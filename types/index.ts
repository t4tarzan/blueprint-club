import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { Team as PrismaTeam, User as PrismaUser, TeamMember, Role, Invitation } from '@prisma/client';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export interface SerializedUser extends Omit<PrismaUser, 'createdAt' | 'updatedAt' | 'emailVerified' | 'lockedAt'> {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
  lockedAt: string | null;
}

export interface SerializedTeamMember extends Omit<TeamMember, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
  user?: SerializedUser;
}

export interface SerializedInvitation extends Omit<Invitation, 'createdAt' | 'expiresAt'> {
  createdAt: string;
  expiresAt: string;
  team?: SerializedTeam;
}

export interface SerializedTeam extends Omit<PrismaTeam, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
  members: SerializedTeamMember[];
  invitations?: SerializedInvitation[];
  creator?: SerializedUser;
}

export interface Team extends PrismaTeam {
  members: TeamMember[];
  invitations?: Invitation[];
  creator?: User;
}

export interface User extends PrismaUser {
  teams?: {
    id: string;
    name: string;
    slug: string;
    role: Role;
  }[];
}

export interface AuditLogMetadata {
  role?: Role;
  reason?: string;
  changes?: {
    [key: string]: {
      from: any;
      to: any;
    };
  };
}

export interface AuditLog {
  id: string;
  createdAt: Date;
  action: string;
  entityId: string;
  entityType: string;
  entityName: string;
  actorId: string;
  actorEmail: string;
  actorName: string | null;
  teamId: string;
  metadata: AuditLogMetadata;
}

export interface SerializedAuditLog extends Omit<AuditLog, 'createdAt'> {
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  teamId: string;
  permissions: string[];
  createdAt: Date;
  expiresAt?: Date;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  message?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface ApiErrorResponse {
  error?: ApiError;
  message?: string;
  status?: number;
}

export type { Role, TeamMember, Invitation };

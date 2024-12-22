import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OWNER' | 'MEMBER';
  teams?: Team[];
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  features: string[];
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: string;
  user: User;
  team: Team;
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

export interface AuditLog {
  id: string;
  type: string;
  actor: string;
  target: string;
  action: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export interface ApiResponse {
  data?: any;
  message?: string;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    code?: string;
  };
}

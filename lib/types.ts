export type MembershipTier = 'free' | 'pro' | 'enterprise';

export interface MembershipFeatures {
  teamSize: number;
  storageLimit: number;
  sso: boolean;
  scim: boolean;
  audit: boolean;
  support: boolean;
  customDomain: boolean;
  api: boolean;
  webhook: boolean;
}

export type Role = 'OWNER' | 'ADMIN' | 'MEMBER';

export type AuditLogAction =
  | 'user.create'
  | 'user.update'
  | 'user.delete'
  | 'team.create'
  | 'team.update'
  | 'team.delete'
  | 'team.member.add'
  | 'team.member.remove'
  | 'team.member.role.update'
  | 'webhook.create'
  | 'webhook.update'
  | 'webhook.delete'
  | 'sso.enable'
  | 'sso.disable'
  | 'scim.enable'
  | 'scim.disable';

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  url: string;
  requestHeaders: Record<string, string>;
  requestBody: string;
  responseHeaders: Record<string, string>;
  responseBody: string;
  statusCode: number;
  duration: number;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: Date | null;
  membershipTier: MembershipTier;
  teams?: {
    id: string;
    name: string;
    role: Role;
  }[];
  currentTeam?: any;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  logo?: string | null;
  members: TeamMember[];
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
  user: User;
  team: Team;
}

export interface Invitation {
  id: string;
  email: string;
  role: Role;
  token: string;
  expires: Date;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
  team: Team;
}

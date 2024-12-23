import type { SAMLServiceConfig } from '@/lib/types/boxyhq';
import { prisma } from '@/lib/prisma';

export const samlConfig: SAMLServiceConfig = {
  externalUrl: process.env.BOXYHQ_SAML_JACKSON_URL || 'http://localhost:5225',
  samlPath: '/api/auth/saml',
  samlAudience: process.env.BOXYHQ_ENTERPRISE_SLUG || 'blueprint-club',
  redirectUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  db: {
    engine: 'prisma',
    prisma,
  },
  idpEnabled: true,
  oidcEnabled: false,
  dsyncEnabled: false,
  apiEnabled: true,
  clientSecretVerifier: process.env.BOXYHQ_CLIENT_SECRET_VERIFIER || 'your-secret-verifier',
};

// Types for enhanced type safety
export interface BoxyHQSession {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    teams?: {
      id: string;
      name: string;
      role: string;
    }[];
  };
  expires: string;
}

export interface BoxyHQTeam {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Constants for BoxyHQ features
export const BOXYHQ_FEATURES = {
  SSO_ENABLED: process.env.ENABLE_SSO === 'true',
  TEAM_FEATURES: process.env.ENABLE_TEAM_FEATURES === 'true',
  DIRECTORY_SYNC: process.env.ENABLE_DIRECTORY_SYNC === 'true',
  AUDIT_LOGS: process.env.ENABLE_AUDIT_LOGS === 'true',
  RBAC: process.env.ENABLE_RBAC === 'true',
};

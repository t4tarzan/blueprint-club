// BoxyHQ SAML and SCIM types
import type { Prisma, PrismaClient } from '@prisma/client';

export type DatabaseEngine = 'sql' | 'postgres' | 'mysql' | 'sqlite' | 'mongodb';

export interface SAMLConfig {
  tenant: string;
  product: string;
  idpMetadata: string;
  defaultRedirectUrl: string;
  redirectUrl?: string;
}

export interface SAMLProviderConfig {
  type: string;
  issuer: string;
  clientID: string;
  clientSecret: string;
  redirectUrl: string;
  decryptionCert?: string;
  decryptionKey?: string;
  signingCert?: string;
  signingKey?: string;
}

export interface SAMLAuthResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  provider: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface SCIMConfig {
  tenant: string;
  product: string;
  token: string;
  endpoint: string;
  resourceType: string;
  created?: string;
  lastModified?: string;
}

export interface SCIMUser {
  id: string;
  userName: string;
  displayName?: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  emails?: Array<{
    value: string;
    type?: string;
    primary?: boolean;
  }>;
  active?: boolean;
  groups?: string[];
  meta?: {
    resourceType: string;
    created?: string;
    lastModified?: string;
  };
}

export interface SCIMGroup {
  id: string;
  displayName: string;
  members?: Array<{
    value: string;
    display?: string;
  }>;
  meta?: {
    resourceType: string;
    created?: string;
    lastModified?: string;
  };
}

export interface BoxyHQConfig {
  samlJacksonUrl: string;
  enterpriseSlug: string;
  adminEmail: string;
  licenseKey?: string;
  clientSecretVerifier?: string;
  databaseEngine?: DatabaseEngine;
  databaseUrl?: string;
}

// SCIM Error type
export interface SCIMError {
  status: number;
  scimType?: string;
  detail: string;
}

export interface SAMLProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  provider?: string;
  tenant?: string;
  product?: string;
}

export interface SAMLServiceConfig {
  externalUrl: string;
  samlPath: string;
  samlAudience: string;
  redirectUrl: string;
  db: {
    engine: 'prisma';
    prisma: PrismaClient<Prisma.PrismaClientOptions, never>;
  };
  idpEnabled: boolean;
  oidcEnabled: boolean;
  dsyncEnabled: boolean;
  apiEnabled: boolean;
  clientSecretVerifier: string;
}

export interface SAMLConnection {
  id: string;
  tenant: string;
  product: string;
  defaultRedirectUrl: string;
  redirectUrl?: string;
  idpMetadata: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SAMLConnectionResponse {
  connection: SAMLConnection;
  clientID: string;
  clientSecret: string;
}

export type AuditLogAction =
  | 'team.created'
  | 'team.updated'
  | 'team.deleted'
  | 'team.member.invited'
  | 'team.member.joined'
  | 'team.member.removed'
  | 'team.member.role_updated'
  | 'team.webhook.created'
  | 'team.webhook.updated'
  | 'team.webhook.deleted';

export interface SAMLClient {
  getAuthUrl(options: {
    tenant: string;
    product: string;
    state?: string;
    redirectUrl?: string;
  }): Promise<string>;
  
  validateSamlResponse(options: {
    samlResponse: string;
    tenant: string;
    product: string;
    redirectUrl?: string;
  }): Promise<SAMLAuthResponse>;
}

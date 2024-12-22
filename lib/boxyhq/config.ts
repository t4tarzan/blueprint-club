import { JacksonOption } from '@boxyhq/saml-jackson';

export const getJacksonOption = (): JacksonOption => {
  return {
    externalUrl: process.env.BOXYHQ_SAML_JACKSON_URL,
    saml: {
      // callback URL to which the IdP will redirect after successful authentication
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/boxyhq-saml`,
      // path to handle SAML response from IdP
      path: '/api/auth/saml/callback',
      // issuer of the SAML request
      issuer: process.env.BOXYHQ_ENTERPRISE_SLUG || 'blueprint-club',
    },
    // Admin API configuration
    admin: {
      email: process.env.BOXYHQ_ADMIN_EMAIL,
      apiKey: process.env.BOXYHQ_LICENSE_KEY,
    },
    // Database configuration for SAML Jackson
    db: {
      engine: 'sql',
      type: 'postgres',
      url: process.env.DATABASE_URL,
    },
    // Optional: Configure product name and logo
    product: {
      name: 'Blueprint Club',
      logo: 'https://www.wnbpc.com/logo.png', // Update with your actual logo URL
    },
  };
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

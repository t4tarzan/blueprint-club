import { SAMLProfile } from '@/lib/types/boxyhq';
import { OAuthConfig } from 'next-auth/providers';
import { env } from '@/env.mjs';

export interface BoxyHQSAMLProfile extends SAMLProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  emailVerified?: Date | null;
  membershipTier?: string;
}

export interface BoxyHQSAMLProvider extends OAuthConfig<BoxyHQSAMLProfile> {
  clientId: string;
  clientSecret: string;
  issuer: string;
  tenantId: string;
}

export const BoxyHQSAMLProvider: BoxyHQSAMLProvider = {
  id: 'boxyhq-saml',
  name: 'BoxyHQ SAML',
  type: 'oauth',
  version: '2.0',
  clientId: env.BOXYHQ_SAML_CLIENT_ID,
  clientSecret: env.BOXYHQ_SAML_CLIENT_SECRET,
  issuer: env.BOXYHQ_SAML_ISSUER,
  tenantId: env.BOXYHQ_SAML_TENANT_ID,
  wellKnown: `${env.BOXYHQ_SAML_ISSUER}/.well-known/openid-configuration`,
  authorization: {
    params: {
      scope: 'openid email profile',
    },
  },
  idToken: true,
  checks: ['pkce', 'state'],
  profile(profile: BoxyHQSAMLProfile) {
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name ?? `${profile.firstName} ${profile.lastName}`.trim(),
      image: null,
      emailVerified: profile.emailVerified ?? null,
      membershipTier: profile.membershipTier ?? 'FREE',
    };
  },
};

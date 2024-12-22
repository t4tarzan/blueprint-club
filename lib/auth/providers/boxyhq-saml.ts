import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

export interface BoxyHQSAMLProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  tenant?: string;
  product?: string;
}

export interface BoxyHQSAMLConfig extends OAuthUserConfig<BoxyHQSAMLProfile> {
  tenant: string;
  product: string;
}

export default function BoxyHQSAMLProvider(
  config: Partial<BoxyHQSAMLConfig> = {}
): OAuthConfig<BoxyHQSAMLProfile> {
  return {
    id: 'boxyhq-saml',
    name: 'BoxyHQ SAML',
    type: 'oauth',
    wellKnown: `${process.env.NEXTAUTH_URL}/api/auth/saml/metadata`,
    authorization: {
      url: `${process.env.NEXTAUTH_URL}/api/auth/saml/authorize`,
      params: {
        tenant: config.tenant,
        product: config.product,
      },
    },
    token: `${process.env.NEXTAUTH_URL}/api/auth/saml/token`,
    userinfo: `${process.env.NEXTAUTH_URL}/api/auth/saml/userinfo`,
    profile(profile: BoxyHQSAMLProfile) {
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name || `${profile.firstName} ${profile.lastName}`.trim(),
        image: null,
      };
    },
    style: {
      logo: '/boxyhq-logo.png',
      logoDark: '/boxyhq-logo-dark.png',
      bg: '#fff',
      text: '#000',
      bgDark: '#000',
      textDark: '#fff',
    },
    options: config,
  };
}

import { OAuthConfig } from 'next-auth/providers';
import { BoxyHQSAMLProfile, BoxyHQSAMLConfig } from '@/lib/types/boxyhq';
import { User } from '@/lib/types/prisma';

export interface BoxyHQSAMLProvider extends OAuthConfig<BoxyHQSAMLProfile> {
  issuer: string;
  clientID: string;
  clientSecret: string;
  callback: string;
}

export default function BoxyHQSAMLProvider(config: BoxyHQSAMLConfig): BoxyHQSAMLProvider {
  return {
    id: 'boxyhq-saml',
    name: 'BoxyHQ SAML',
    type: 'oauth',
    version: '2.0',
    issuer: config.issuer,
    clientId: config.clientID,
    clientSecret: config.clientSecret,
    callback: config.callback,
    authorization: {
      url: `${config.issuer}/api/oauth/authorize`,
      params: {
        scope: '',
        response_type: 'code',
        provider: 'saml',
      },
    },
    token: `${config.issuer}/api/oauth/token`,
    userinfo: `${config.issuer}/api/oauth/userinfo`,
    profile(profile: BoxyHQSAMLProfile): User {
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        image: null,
        emailVerified: new Date(),
      };
    },
  };
}

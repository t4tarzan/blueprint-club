import { jackson, JacksonOption } from '@boxyhq/saml-jackson';
import { prisma } from '@/lib/prisma';

export interface SAMLConfig {
  encodedRawMetadata?: string;
  metadataUrl?: string;
  defaultRedirectUrl: string;
  redirectUrl: string[];
  tenant: string;
  product: string;
}

export interface SAMLConnection {
  tenant: string;
  product: string;
  defaultRedirectUrl: string;
  redirectUrl: string[];
  name?: string;
  description?: string;
  encodedRawMetadata?: string;
  metadataUrl?: string;
}

export class SAMLService {
  private jacksonClient: any;

  constructor() {
    this.initJackson();
  }

  private async initJackson() {
    const options: JacksonOption = {
      externalUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      db: {
        engine: 'sql',
        type: 'postgres',
        url: process.env.DATABASE_URL!,
      },
      saml: {
        callback: '/api/auth/saml/callback',
      },
    };

    this.jacksonClient = await jackson(options);
  }

  async createConnection(config: SAMLConfig) {
    const connection = await this.jacksonClient.connectionAPIController.createSAMLConnection({
      encodedRawMetadata: config.encodedRawMetadata,
      metadataUrl: config.metadataUrl,
      defaultRedirectUrl: config.defaultRedirectUrl,
      redirectUrl: config.redirectUrl,
      tenant: config.tenant,
      product: config.product,
    });

    return connection;
  }

  async getConnection(tenant: string, product: string) {
    const connection = await this.jacksonClient.connectionAPIController.getSAMLConnection({
      tenant,
      product,
    });

    return connection;
  }

  async deleteConnection(tenant: string, product: string) {
    await this.jacksonClient.connectionAPIController.deleteSAMLConnection({
      tenant,
      product,
    });
  }

  async getMetadata(tenant: string, product: string) {
    const metadata = await this.jacksonClient.connectionAPIController.getMetadata({
      tenant,
      product,
    });

    return metadata;
  }

  async validateSAMLResponse(payload: any) {
    const response = await this.jacksonClient.authAPIController.validateSAMLResponse(payload);
    return response;
  }

  async getAuthorizationUrl(tenant: string, product: string, redirectUrl?: string) {
    const url = await this.jacksonClient.authAPIController.getAuthorizationUrl({
      tenant,
      product,
      redirectUrl,
    });

    return url;
  }

  async getOAuthToken(code: string) {
    const token = await this.jacksonClient.authAPIController.getOAuthToken({
      code,
    });

    return token;
  }

  async getUserInfo(token: string) {
    const userInfo = await this.jacksonClient.authAPIController.userInfo({
      token,
    });

    return userInfo;
  }
}

import { default as Jackson } from '@boxyhq/saml-jackson';
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
  private static instance: any;

  static async getInstance() {
    if (!this.instance) {
      this.instance = await Jackson({
        externalUrl: process.env.NEXTAUTH_URL,
        samlAudience: process.env.NEXTAUTH_URL,
        samlPath: '/api/auth/saml',
        db: {
          engine: 'prisma',
          prisma,
        },
      });
    }
    return this.instance;
  }

  static async getMetadata() {
    const instance = await this.getInstance();
    return instance.getMetadata();
  }

  static async createConnection(data: SAMLConfig) {
    const instance = await this.getInstance();
    return instance.createConnection({
      encodedRawMetadata: data.encodedRawMetadata,
      metadataUrl: data.metadataUrl,
      defaultRedirectUrl: data.defaultRedirectUrl,
      redirectUrl: data.redirectUrl,
      tenant: data.tenant,
      product: data.product,
    });
  }

  static async deleteConnection(tenant: string, product: string) {
    const instance = await this.getInstance();
    return instance.deleteConnection({
      tenant,
      product,
    });
  }

  static async getConnection(tenant: string, product: string) {
    const instance = await this.getInstance();
    return instance.getConnection({
      tenant,
      product,
    });
  }

  static async getConnections() {
    const instance = await this.getInstance();
    return instance.getConnections();
  }

  static async validateSAMLResponse(payload: any) {
    const instance = await this.getInstance();
    const response = await instance.validateSAMLResponse(payload);
    return response;
  }

  static async getAuthorizationUrl(tenant: string, product: string, redirectUrl?: string) {
    const instance = await this.getInstance();
    const url = await instance.getAuthorizationUrl({
      tenant,
      product,
      redirectUrl,
    });

    return url;
  }

  static async getOAuthToken(code: string) {
    const instance = await this.getInstance();
    const token = await instance.getOAuthToken({
      code,
    });

    return token;
  }

  static async getUserInfo(token: string) {
    const instance = await this.getInstance();
    const userInfo = await instance.userInfo({
      token,
    });

    return userInfo;
  }
}

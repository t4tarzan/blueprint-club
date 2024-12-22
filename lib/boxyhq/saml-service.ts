import { Jackson } from '@boxyhq/saml-jackson';
import type { SAMLConnection } from '@boxyhq/saml-jackson/dist/src/typings';
import { getJacksonOption } from './config';

export class SAMLService {
  private static instance: SAMLService;
  private jackson: Promise<any>;

  private constructor() {
    this.jackson = Jackson.init(getJacksonOption());
  }

  public static getInstance(): SAMLService {
    if (!SAMLService.instance) {
      SAMLService.instance = new SAMLService();
    }
    return SAMLService.instance;
  }

  /**
   * Create a new SAML connection for a team
   */
  async createConnection(params: {
    tenant: string;
    product: string;
    encodedRawMetadata?: string;
    metadataUrl?: string;
    defaultRedirectUrl?: string;
    redirectUrl?: string[];
    entityId?: string;
    acsUrl?: string;
    idpUrl?: string;
    certificate?: string;
  }): Promise<SAMLConnection> {
    const jackson = await this.jackson;
    return jackson.createSamlConnection(params);
  }

  /**
   * Get SAML connection for a team
   */
  async getConnection(tenant: string, product: string): Promise<SAMLConnection | null> {
    const jackson = await this.jackson;
    return jackson.getSamlConnection({ tenant, product });
  }

  /**
   * Delete SAML connection for a team
   */
  async deleteConnection(tenant: string, product: string): Promise<void> {
    const jackson = await this.jackson;
    await jackson.deleteSamlConnection({ tenant, product });
  }

  /**
   * Get SAML metadata for a team
   */
  async getMetadata(tenant: string, product: string): Promise<string> {
    const jackson = await this.jackson;
    return jackson.metadata({ tenant, product });
  }

  /**
   * Validate SAML response
   */
  async validateSamlResponse(params: {
    samlResponse: string;
    relayState?: string;
  }): Promise<{
    profile: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      name?: string;
    };
    tenant: string;
    product: string;
  }> {
    const jackson = await this.jackson;
    return jackson.validateSamlResponse(params);
  }

  /**
   * Get OAuth authorization URL
   */
  async getAuthorizationUrl(params: {
    tenant: string;
    product: string;
    redirectUri: string;
    state?: string;
  }): Promise<string> {
    const jackson = await this.jackson;
    return jackson.getAuthorizationUrl(params);
  }

  /**
   * Get OAuth access token
   */
  async getOAuthToken(params: {
    code: string;
    redirectUri: string;
  }): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }> {
    const jackson = await this.jackson;
    return jackson.getOAuthToken(params);
  }

  /**
   * Get user profile from OAuth token
   */
  async getUserInfo(accessToken: string): Promise<{
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  }> {
    const jackson = await this.jackson;
    return jackson.userInfo(accessToken);
  }
}

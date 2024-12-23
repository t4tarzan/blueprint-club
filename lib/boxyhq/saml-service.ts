import { prisma } from '@/lib/prisma';
import { SAMLConfig, SAMLAuthResponse } from '@/lib/types/boxyhq';

// Temporarily disabled for initial deployment
export class SAMLService {
  private static instance: SAMLService;

  private constructor() {}

  static getInstance(): SAMLService {
    if (!SAMLService.instance) {
      SAMLService.instance = new SAMLService();
    }
    return SAMLService.instance;
  }

  async createConfig(config: SAMLConfig): Promise<void> {
    // Temporarily disabled
  }

  async getConfig(tenant: string, product: string): Promise<SAMLConfig | null> {
    return null;
  }

  async updateConfig(tenant: string, product: string, config: Partial<SAMLConfig>): Promise<void> {
    // Temporarily disabled
  }

  async deleteConfig(tenant: string, product: string): Promise<void> {
    // Temporarily disabled
  }

  async validateSamlResponse(tenant: string, product: string, redirectUrl?: string): Promise<SAMLAuthResponse> {
    return {
      id: 'dummy',
      email: 'dummy@example.com',
      firstName: 'Dummy',
      lastName: 'User',
      provider: 'saml'
    };
  }

  async getAuthUrl(tenant: string, product: string, state?: string, redirectUrl?: string): Promise<string> {
    return 'https://example.com/auth';
  }
}

export const samlService = SAMLService.getInstance();

import { prisma } from '@/lib/prisma';
import { SCIMConfig } from '@/lib/types/boxyhq';

export class SCIMService {
  private static instance: SCIMService;

  private constructor() {}

  static getInstance(): SCIMService {
    if (!SCIMService.instance) {
      SCIMService.instance = new SCIMService();
    }
    return SCIMService.instance;
  }

  async createConfig(config: SCIMConfig): Promise<void> {
    // Temporarily disabled
  }

  async getConfig(tenant: string, product: string): Promise<SCIMConfig | null> {
    return null;
  }

  async updateConfig(tenant: string, product: string, config: Partial<SCIMConfig>): Promise<void> {
    // Temporarily disabled
  }

  async deleteConfig(tenant: string, product: string): Promise<void> {
    // Temporarily disabled
  }

  async listUsers(tenant: string, product: string): Promise<any[]> {
    return [];
  }

  async getUser(tenant: string, product: string, userId: string): Promise<any | null> {
    return null;
  }

  async createUser(tenant: string, product: string, userData: any): Promise<any> {
    return {};
  }

  async updateUser(tenant: string, product: string, userId: string, userData: any): Promise<any> {
    return {};
  }

  async deleteUser(tenant: string, product: string, userId: string): Promise<void> {
    // Temporarily disabled
  }
}

import type { SAMLSSORecord } from '@boxyhq/saml-jackson/dist/typings';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import type { SCIMConfig, SCIMUser, SCIMGroup } from '@/lib/types/boxyhq';

export class SCIMService {
  private static instance: SCIMService;
  private jackson: any;

  private constructor() {
    this.initializeJackson();
  }

  private async initializeJackson() {
    const opts = {
      db: {
        engine: 'prisma',
        prisma,
      },
      scim: {
        enabled: true,
      },
    };

    // Use require to avoid type issues
    const jackson = require('@boxyhq/saml-jackson');
    this.jackson = await jackson(opts);
  }

  public static getInstance(): SCIMService {
    if (!SCIMService.instance) {
      SCIMService.instance = new SCIMService();
    }
    return SCIMService.instance;
  }

  async createConfig(tenant: string, product: string): Promise<SCIMConfig> {
    const { directorySyncController } = this.jackson;

    const clientId = tenant;
    const clientSecret = randomBytes(32).toString('hex');

    const config = await directorySyncController.createConfig({
      tenant,
      product,
      clientId,
      clientSecret,
    });

    return config;
  }

  async getConfig(tenant: string, product: string): Promise<SCIMConfig | null> {
    const { directorySyncController } = this.jackson;

    const config = await directorySyncController.getConfig({
      tenant,
      product,
    });

    return config;
  }

  async deleteConfig(tenant: string, product: string): Promise<void> {
    const { directorySyncController } = this.jackson;

    await directorySyncController.deleteConfig({
      tenant,
      product,
    });
  }

  async getUsers(tenant: string, product: string): Promise<SCIMUser[]> {
    const { directorySyncController } = this.jackson;

    const users = await directorySyncController.getUsers({
      tenant,
      product,
    });

    return users;
  }

  async getUser(tenant: string, product: string, id: string): Promise<SCIMUser | null> {
    const { directorySyncController } = this.jackson;

    const user = await directorySyncController.getUser({
      tenant,
      product,
      id,
    });

    return user;
  }

  async createUser(tenant: string, product: string, user: SCIMUser): Promise<SCIMUser> {
    const { directorySyncController } = this.jackson;

    const newUser = await directorySyncController.createUser({
      tenant,
      product,
      user,
    });

    return newUser;
  }

  async updateUser(tenant: string, product: string, id: string, user: SCIMUser): Promise<SCIMUser> {
    const { directorySyncController } = this.jackson;

    const updatedUser = await directorySyncController.updateUser({
      tenant,
      product,
      id,
      user,
    });

    return updatedUser;
  }

  async deleteUser(tenant: string, product: string, id: string): Promise<void> {
    const { directorySyncController } = this.jackson;

    await directorySyncController.deleteUser({
      tenant,
      product,
      id,
    });
  }

  async getGroups(tenant: string, product: string): Promise<SCIMGroup[]> {
    const { directorySyncController } = this.jackson;

    const groups = await directorySyncController.getGroups({
      tenant,
      product,
    });

    return groups;
  }

  async getGroup(tenant: string, product: string, id: string): Promise<SCIMGroup | null> {
    const { directorySyncController } = this.jackson;

    const group = await directorySyncController.getGroup({
      tenant,
      product,
      id,
    });

    return group;
  }

  async createGroup(tenant: string, product: string, group: SCIMGroup): Promise<SCIMGroup> {
    const { directorySyncController } = this.jackson;

    const newGroup = await directorySyncController.createGroup({
      tenant,
      product,
      group,
    });

    return newGroup;
  }

  async updateGroup(tenant: string, product: string, id: string, group: SCIMGroup): Promise<SCIMGroup> {
    const { directorySyncController } = this.jackson;

    const updatedGroup = await directorySyncController.updateGroup({
      tenant,
      product,
      id,
      group,
    });

    return updatedGroup;
  }

  async deleteGroup(tenant: string, product: string, id: string): Promise<void> {
    const { directorySyncController } = this.jackson;

    await directorySyncController.deleteGroup({
      tenant,
      product,
      id,
    });
  }
}

export const scimService = SCIMService.getInstance();

import { ScimService } from '@boxyhq/scim-server-node';
import { prisma } from '../prisma';
import { Role } from '@prisma/client';

export class SCIMProvider {
  private static instance: SCIMProvider;
  private scimService: ScimService;

  private constructor() {
    this.scimService = new ScimService({
      enterprise_slug: process.env.BOXYHQ_ENTERPRISE_SLUG || 'blueprint-club',
      enterprise_name: process.env.BOXYHQ_ENTERPRISE_NAME || 'Blueprint Club',
      tenant_url_prefix: process.env.BOXYHQ_TENANT_URL_PREFIX || 'https://app.blueprint-club.com/teams',
      directory_sync: {
        apiKey: process.env.BOXYHQ_DIRECTORY_SYNC_API_KEY,
        baseUrl: process.env.BOXYHQ_DIRECTORY_SYNC_BASE_URL,
      },
    });
  }

  public static getInstance(): SCIMProvider {
    if (!SCIMProvider.instance) {
      SCIMProvider.instance = new SCIMProvider();
    }
    return SCIMProvider.instance;
  }

  // User Management
  async createUser(teamId: string, userData: any) {
    try {
      const { email, name, active = true } = userData;

      // Create or update user in the database
      const user = await prisma.user.upsert({
        where: { email },
        create: {
          email,
          name,
          emailVerified: new Date(),
        },
        update: {
          name,
        },
      });

      // Add user to team if active
      if (active) {
        await prisma.teamMember.create({
          data: {
            teamId,
            userId: user.id,
            role: Role.MEMBER,
          },
        });
      }

      return {
        id: user.id,
        userName: user.email,
        active,
        name: {
          givenName: user.name?.split(' ')[0] || '',
          familyName: user.name?.split(' ').slice(1).join(' ') || '',
        },
        emails: [{ value: user.email, primary: true }],
      };
    } catch (error) {
      console.error('SCIM create user error:', error);
      throw error;
    }
  }

  async updateUser(teamId: string, userId: string, userData: any) {
    try {
      const { email, name, active } = userData;

      // Update user in the database
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
        },
      });

      // Handle team membership based on active status
      if (active === false) {
        // Remove from team if deactivated
        await prisma.teamMember.deleteMany({
          where: {
            teamId,
            userId,
          },
        });
      } else if (active === true) {
        // Add to team if activated
        await prisma.teamMember.upsert({
          where: {
            teamId_userId: {
              teamId,
              userId,
            },
          },
          create: {
            teamId,
            userId,
            role: Role.MEMBER,
          },
          update: {},
        });
      }

      return {
        id: user.id,
        userName: user.email,
        active,
        name: {
          givenName: user.name?.split(' ')[0] || '',
          familyName: user.name?.split(' ').slice(1).join(' ') || '',
        },
        emails: [{ value: user.email, primary: true }],
      };
    } catch (error) {
      console.error('SCIM update user error:', error);
      throw error;
    }
  }

  async deleteUser(teamId: string, userId: string) {
    try {
      // Remove user from team
      await prisma.teamMember.deleteMany({
        where: {
          teamId,
          userId,
        },
      });

      // Note: We don't delete the user account, just remove team membership
      return null;
    } catch (error) {
      console.error('SCIM delete user error:', error);
      throw error;
    }
  }

  async getUser(teamId: string, userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          teams: {
            where: { teamId },
          },
        },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        userName: user.email,
        active: user.teams.length > 0,
        name: {
          givenName: user.name?.split(' ')[0] || '',
          familyName: user.name?.split(' ').slice(1).join(' ') || '',
        },
        emails: [{ value: user.email, primary: true }],
      };
    } catch (error) {
      console.error('SCIM get user error:', error);
      throw error;
    }
  }

  async listUsers(teamId: string, params: any) {
    try {
      const { startIndex = 1, count = 100, filter } = params;
      const skip = startIndex - 1;

      // Build where clause based on filter
      let where: any = {
        teams: {
          some: {
            teamId,
          },
        },
      };

      if (filter) {
        // Handle SCIM filters (basic implementation)
        if (filter.includes('userName eq')) {
          const email = filter.split('"')[1];
          where = {
            ...where,
            email,
          };
        }
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: count,
          include: {
            teams: {
              where: { teamId },
            },
          },
        }),
        prisma.user.count({ where }),
      ]);

      return {
        Resources: users.map(user => ({
          id: user.id,
          userName: user.email,
          active: user.teams.length > 0,
          name: {
            givenName: user.name?.split(' ')[0] || '',
            familyName: user.name?.split(' ').slice(1).join(' ') || '',
          },
          emails: [{ value: user.email, primary: true }],
        })),
        itemsPerPage: count,
        startIndex,
        totalResults: total,
      };
    } catch (error) {
      console.error('SCIM list users error:', error);
      throw error;
    }
  }

  // Group Management
  async createGroup(teamId: string, groupData: any) {
    try {
      const { displayName, members = [] } = groupData;

      // Create group in the database
      const group = await prisma.group.create({
        data: {
          name: displayName,
          teamId,
          members: {
            create: members.map((member: any) => ({
              userId: member.value,
            })),
          },
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });

      return {
        id: group.id,
        displayName: group.name,
        members: group.members.map(member => ({
          value: member.userId,
          display: member.user.name || member.user.email,
        })),
      };
    } catch (error) {
      console.error('SCIM create group error:', error);
      throw error;
    }
  }

  async updateGroup(teamId: string, groupId: string, groupData: any) {
    try {
      const { displayName, members = [] } = groupData;

      // Update group in the database
      await prisma.$transaction(async (prisma) => {
        // Update group name if provided
        if (displayName) {
          await prisma.group.update({
            where: { id: groupId },
            data: { name: displayName },
          });
        }

        // Remove all existing members
        await prisma.groupMember.deleteMany({
          where: { groupId },
        });

        // Add new members
        if (members.length > 0) {
          await prisma.groupMember.createMany({
            data: members.map((member: any) => ({
              groupId,
              userId: member.value,
            })),
          });
        }
      });

      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!group) {
        throw new Error('Group not found');
      }

      return {
        id: group.id,
        displayName: group.name,
        members: group.members.map(member => ({
          value: member.userId,
          display: member.user.name || member.user.email,
        })),
      };
    } catch (error) {
      console.error('SCIM update group error:', error);
      throw error;
    }
  }

  async deleteGroup(teamId: string, groupId: string) {
    try {
      await prisma.group.delete({
        where: { id: groupId },
      });

      return null;
    } catch (error) {
      console.error('SCIM delete group error:', error);
      throw error;
    }
  }

  async getGroup(teamId: string, groupId: string) {
    try {
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!group) {
        return null;
      }

      return {
        id: group.id,
        displayName: group.name,
        members: group.members.map(member => ({
          value: member.userId,
          display: member.user.name || member.user.email,
        })),
      };
    } catch (error) {
      console.error('SCIM get group error:', error);
      throw error;
    }
  }

  async listGroups(teamId: string, params: any) {
    try {
      const { startIndex = 1, count = 100 } = params;
      const skip = startIndex - 1;

      const [groups, total] = await Promise.all([
        prisma.group.findMany({
          where: { teamId },
          skip,
          take: count,
          include: {
            members: {
              include: {
                user: true,
              },
            },
          },
        }),
        prisma.group.count({
          where: { teamId },
        }),
      ]);

      return {
        Resources: groups.map(group => ({
          id: group.id,
          displayName: group.name,
          members: group.members.map(member => ({
            value: member.userId,
            display: member.user.name || member.user.email,
          })),
        })),
        itemsPerPage: count,
        startIndex,
        totalResults: total,
      };
    } catch (error) {
      console.error('SCIM list groups error:', error);
      throw error;
    }
  }
}

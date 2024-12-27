import { Adapter } from 'next-auth/adapters';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { Prisma, Role, User } from '@prisma/client';

export interface AdapterUser extends User {
  teams: {
    id: string;
    name: string;
    slug: string;
    role: Role;
  }[];
}

interface CreateUserData {
  email: string;
  emailVerified?: Date | null;
  name?: string | null;
  image?: string | null;
}

export function CustomPrismaAdapter(): Adapter {
  const adapter = PrismaAdapter(prisma);

  return {
    ...adapter,
    createUser: async (data: CreateUserData): Promise<AdapterUser> => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          emailVerified: data.emailVerified,
          name: data.name,
          image: data.image,
          membershipTier: 'FREE',
        },
        include: {
          teams: {
            include: {
              team: true,
            },
          },
        },
      });

      return {
        ...user,
        teams: user.teams.map((membership) => ({
          id: membership.team.id,
          name: membership.team.name,
          slug: membership.team.slug,
          role: membership.role,
        })),
      };
    },

    getUser: async (id: string): Promise<AdapterUser> => {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          teams: {
            include: {
              team: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        ...user,
        teams: user.teams.map((membership) => ({
          id: membership.team.id,
          name: membership.team.name,
          slug: membership.team.slug,
          role: membership.role,
        })),
      };
    },

    getUserByEmail: async (email: string): Promise<AdapterUser> => {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          teams: {
            include: {
              team: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        ...user,
        teams: user.teams.map((membership) => ({
          id: membership.team.id,
          name: membership.team.name,
          slug: membership.team.slug,
          role: membership.role,
        })),
      };
    },

    updateUser: async (data: Partial<User>): Promise<AdapterUser> => {
      const { id, ...userData } = data;

      const user = await prisma.user.update({
        where: { id: id as string },
        data: userData as any,
        include: {
          teams: {
            include: {
              team: true,
            },
          },
        },
      });

      return {
        ...user,
        teams: user.teams.map((membership) => ({
          id: membership.team.id,
          name: membership.team.name,
          slug: membership.team.slug,
          role: membership.role,
        })),
      };
    },
  };
}

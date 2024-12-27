import { Adapter, AdapterUser } from 'next-auth/adapters';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { Prisma, Role, User, MembershipTier, TeamMember } from '@prisma/client';

export interface TeamInfo {
  id: string;
  name: string;
  slug: string;
  role: Role;
}

type UserWithTeams = User & {
  teams: (TeamMember & {
    team: {
      id: string;
      name: string;
      slug: string;
    };
  })[];
};

export function CustomPrismaAdapter(): Adapter {
  const baseAdapter = PrismaAdapter(prisma);

  return {
    ...baseAdapter,
    createUser: async (data: { email: string; emailVerified?: Date | null; name?: string | null; image?: string | null }) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          emailVerified: data.emailVerified,
          name: data.name,
          image: data.image,
          membershipTier: MembershipTier.FREE,
        },
        include: {
          teams: {
            include: {
              team: true,
            },
          },
        },
      });

      const adaptedUser = {
        ...user,
        teams: user.teams.map((membership) => ({
          id: membership.team.id,
          name: membership.team.name,
          slug: membership.team.slug,
          role: membership.role,
        })),
      };

      return adaptedUser as unknown as AdapterUser;
    },

    getUser: async (id: string) => {
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

      if (!user) return null;

      const adaptedUser = {
        ...user,
        teams: user.teams.map((membership) => ({
          id: membership.team.id,
          name: membership.team.name,
          slug: membership.team.slug,
          role: membership.role,
        })),
      };

      return adaptedUser as unknown as AdapterUser;
    },

    getUserByEmail: async (email: string) => {
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

      if (!user) return null;

      const adaptedUser = {
        ...user,
        teams: user.teams.map((membership) => ({
          id: membership.team.id,
          name: membership.team.name,
          slug: membership.team.slug,
          role: membership.role,
        })),
      };

      return adaptedUser as unknown as AdapterUser;
    },

    updateUser: async (userData: Partial<AdapterUser> & { id: string }) => {
      const { id, teams: _, membershipTier, ...restData } = userData;

      const updateData: Prisma.UserUpdateInput = {
        ...restData,
        ...(membershipTier && {
          membershipTier: membershipTier as MembershipTier
        })
      };

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        include: {
          teams: {
            include: {
              team: true,
            },
          },
        },
      }) as UserWithTeams;

      const adaptedUser = {
        ...user,
        teams: user.teams.map((membership) => ({
          id: membership.team.id,
          name: membership.team.name,
          slug: membership.team.slug,
          role: membership.role,
        })),
      };

      return adaptedUser as unknown as AdapterUser;
    },
  };
}

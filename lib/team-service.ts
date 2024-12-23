import { prisma } from '@/lib/prisma';
import { Role, SerializedTeam, SerializedTeamMember, Team, TeamMember, TeamWithMembers } from '@/lib/types/prisma';
import { Prisma } from '@prisma/client';

export class TeamService {
  async findById(id: string): Promise<TeamWithMembers | null> {
    return prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });
  }

  async findBySlug(slug: string): Promise<TeamWithMembers | null> {
    return prisma.team.findUnique({
      where: { slug },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });
  }

  async findByUser(userId: string): Promise<TeamWithMembers[]> {
    return prisma.team.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });
  }

  async create(
    name: string,
    userId: string,
    slug?: string
  ): Promise<TeamWithMembers> {
    const teamSlug = slug || this.generateSlug(name);

    return prisma.team.create({
      data: {
        name,
        slug: teamSlug,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: Partial<Pick<Team, 'name' | 'slug'>>
  ): Promise<TeamWithMembers> {
    return prisma.team.update({
      where: { id },
      data,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });
  }

  async delete(id: string): Promise<Team> {
    return prisma.team.delete({
      where: { id },
    });
  }

  async addMember(
    teamId: string,
    userId: string,
    role: Role = 'MEMBER'
  ): Promise<TeamMember> {
    return prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role,
      },
    });
  }

  async updateMember(
    teamId: string,
    userId: string,
    role: Role
  ): Promise<TeamMember> {
    return prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      data: {
        role,
      },
    });
  }

  async removeMember(teamId: string, userId: string): Promise<TeamMember> {
    return prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });
  }

  async findMember(teamId: string, userId: string): Promise<TeamMember & {
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  } | null> {
    return prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';
import { hasTeamRole } from '../../../../lib/boxyhq/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const teamId = req.query.id as string;

  // Check if user is a member of the team
  const isMember = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: session.user.id,
    },
  });

  if (!isMember) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  switch (req.method) {
    case 'GET':
      return getTeam(req, res);
    case 'PATCH':
      return updateTeam(req, res, session);
    case 'DELETE':
      return deleteTeam(req, res, session);
    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

// Get team details
async function getTeam(req: NextApiRequest, res: NextApiResponse) {
  const teamId = req.query.id as string;

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
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

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    return res.status(200).json(team);
  } catch (error) {
    console.error('Failed to fetch team:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update team details
async function updateTeam(req: NextApiRequest, res: NextApiResponse, session: any) {
  const teamId = req.query.id as string;
  const { name, domain } = req.body;

  try {
    // Check if user has permission to update team
    const hasPermission = await hasTeamRole({
      userId: session.user.id,
      teamId,
      roles: ['OWNER', 'ADMIN'],
    });

    if (!hasPermission) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Check if domain is already in use by another team
    if (domain) {
      const existingTeam = await prisma.team.findFirst({
        where: {
          domain,
          NOT: {
            id: teamId,
          },
        },
      });

      if (existingTeam) {
        return res.status(400).json({ message: 'Domain is already in use' });
      }
    }

    const team = await prisma.team.update({
      where: { id: teamId },
      data: {
        name: name || undefined,
        domain: domain || null,
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

    return res.status(200).json(team);
  } catch (error) {
    console.error('Failed to update team:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete team
async function deleteTeam(req: NextApiRequest, res: NextApiResponse, session: any) {
  const teamId = req.query.id as string;

  try {
    // Only team owner can delete the team
    const hasPermission = await hasTeamRole({
      userId: session.user.id,
      teamId,
      roles: ['OWNER'],
    });

    if (!hasPermission) {
      return res.status(403).json({ message: 'Only team owners can delete teams' });
    }

    // Delete team and all related data
    await prisma.$transaction([
      // Delete team invitations
      prisma.invitation.deleteMany({
        where: { teamId },
      }),
      // Delete team members
      prisma.teamMember.deleteMany({
        where: { teamId },
      }),
      // Delete API keys
      prisma.apiKey.deleteMany({
        where: { teamId },
      }),
      // Delete the team
      prisma.team.delete({
        where: { id: teamId },
      }),
    ]);

    return res.status(204).end();
  } catch (error) {
    console.error('Failed to delete team:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

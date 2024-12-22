import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../lib/prisma';
import { hasTeamRole } from '../../../../../lib/boxyhq/utils';
import { Role } from '@prisma/client';
import { checkTeamMemberLimit } from '../../../../../lib/subscription';

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
      return getMembers(req, res);
    case 'POST':
      return addMember(req, res, session);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

// Get team members
async function getMembers(req: NextApiRequest, res: NextApiResponse) {
  const teamId = req.query.id as string;

  try {
    const members = await prisma.teamMember.findMany({
      where: { teamId },
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

    return res.status(200).json(members);
  } catch (error) {
    console.error('Failed to fetch team members:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Add new member directly (for development/testing)
async function addMember(req: NextApiRequest, res: NextApiResponse, session: any) {
  const teamId = req.query.id as string;
  const { email, role = Role.MEMBER } = req.body;

  try {
    // Check if user has permission to add members
    const hasPermission = await hasTeamRole(teamId, session.user.id, [Role.ADMIN, Role.OWNER]);
    if (!hasPermission) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Check subscription limits
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { createdById: true },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const { allowed, limit, current } = await checkTeamMemberLimit(team.createdById);
    if (!allowed) {
      return res.status(403).json({
        message: `Team member limit reached (${current}/${limit}). Please upgrade your subscription to add more members.`,
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: user.id,
      },
    });

    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member of this team' });
    }

    // Add member
    const member = await prisma.teamMember.create({
      data: {
        teamId,
        userId: user.id,
        role,
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

    return res.status(201).json(member);
  } catch (error) {
    console.error('Error adding team member:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

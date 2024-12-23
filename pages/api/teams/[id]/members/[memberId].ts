import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../lib/prisma';
import { hasTeamRole } from '../../../../../lib/boxyhq/utils';
import { Role } from '@prisma/client';
import { emailService } from '../../../../../lib/email';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const teamId = req.query.id as string;
  const memberId = req.query.memberId as string;

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
      return getMember(req, res);
    case 'PATCH':
      return updateMember(req, res, session);
    case 'DELETE':
      return removeMember(req, res, session);
    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

// Get member details
async function getMember(req: NextApiRequest, res: NextApiResponse) {
  const teamId = req.query.id as string;
  const memberId = req.query.memberId as string;

  try {
    const member = await prisma.teamMember.findUnique({
      where: {
        id: memberId,
        teamId,
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

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    return res.status(200).json(member);
  } catch (error) {
    console.error('Failed to fetch team member:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update member role
async function updateMember(req: NextApiRequest, res: NextApiResponse, session: any) {
  const teamId = req.query.id as string;
  const memberId = req.query.memberId as string;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: 'Role is required' });
  }

  try {
    // Check if user has permission to update members
    const hasPermission = await hasTeamRole({
      userId: session.user.id,
      teamId,
      roles: ['OWNER', 'ADMIN'],
    });

    if (!hasPermission) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Get current member
    const currentMember = await prisma.teamMember.findUnique({
      where: {
        id: memberId,
        teamId,
      },
      include: {
        user: true,
      },
    });

    if (!currentMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Prevent changing the role of the last owner
    if (currentMember.role === 'OWNER') {
      const ownerCount = await prisma.teamMember.count({
        where: {
          teamId,
          role: 'OWNER',
        },
      });

      if (ownerCount === 1 && role !== 'OWNER') {
        return res.status(400).json({ message: 'Cannot change role of the last owner' });
      }
    }

    // Get team for email notification
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get updater for email notification
    const updater = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!updater) {
      return res.status(404).json({ message: 'Updater not found' });
    }

    // Update member role
    const updatedMember = await prisma.teamMember.update({
      where: {
        id: memberId,
      },
      data: {
        role: role as Role,
      },
      include: {
        user: true,
      },
    });

    // Send role change notification
    await emailService.sendRoleChangeEmail(updatedMember.user.email!, team.name, role);

    return res.status(200).json(updatedMember);
  } catch (error) {
    console.error('Failed to update team member:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Remove member from team
async function removeMember(req: NextApiRequest, res: NextApiResponse, session: any) {
  const teamId = req.query.id as string;
  const memberId = req.query.memberId as string;

  try {
    // Check if user has permission to remove members
    const hasPermission = await hasTeamRole({
      userId: session.user.id,
      teamId,
      roles: ['OWNER', 'ADMIN'],
    });

    if (!hasPermission) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Get member to be removed
    const member = await prisma.teamMember.findUnique({
      where: {
        id: memberId,
        teamId,
      },
      include: {
        user: true,
      },
    });

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Prevent removing the last owner
    if (member.role === 'OWNER') {
      const ownerCount = await prisma.teamMember.count({
        where: {
          teamId,
          role: 'OWNER',
        },
      });

      if (ownerCount === 1) {
        return res.status(400).json({ message: 'Cannot remove the last owner' });
      }
    }

    // Get team for email notification
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get remover for email notification
    const remover = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!remover) {
      return res.status(404).json({ message: 'Remover not found' });
    }

    // Remove member
    await prisma.teamMember.delete({
      where: {
        id: memberId,
      },
    });

    // Send member removal notification
    await emailService.sendMemberRemovalEmail(member.user.email!, team.name);

    return res.status(204).end();
  } catch (error) {
    console.error('Failed to remove team member:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

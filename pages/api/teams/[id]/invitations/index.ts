import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../lib/prisma';
import { hasTeamRole } from '../../../../../lib/boxyhq/utils';
import { Role } from '@prisma/client';
import crypto from 'crypto';
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
      return getInvitations(req, res);
    case 'POST':
      return createInvitation(req, res, session);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

// Get team invitations
async function getInvitations(req: NextApiRequest, res: NextApiResponse) {
  const teamId = req.query.id as string;

  try {
    const invitations = await prisma.invitation.findMany({
      where: { teamId },
      include: {
        team: true,
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return res.status(200).json(invitations);
  } catch (error) {
    console.error('Failed to fetch invitations:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create new invitation
async function createInvitation(req: NextApiRequest, res: NextApiResponse, session: any) {
  const teamId = req.query.id as string;
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: 'Email and role are required' });
  }

  try {
    // Check if user has permission to send invitations
    const hasPermission = await hasTeamRole({
      userId: session.user.id,
      teamId,
      roles: ['OWNER', 'ADMIN'],
    });

    if (!hasPermission) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        team: { id: teamId },
        user: { email },
      },
    });

    if (existingMember) {
      return res.status(400).json({ message: 'User is already a team member' });
    }

    // Check for existing pending invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        teamId,
        email,
        status: 'PENDING',
      },
    });

    if (existingInvitation) {
      return res.status(400).json({ message: 'Invitation already sent' });
    }

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        teamId,
        email,
        role: role as Role,
        token: crypto.randomBytes(32).toString('hex'),
        inviterId: session.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      include: {
        team: true,
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Send invitation email
    await emailService.sendTeamInvitation(invitation);

    return res.status(201).json(invitation);
  } catch (error) {
    console.error('Failed to create invitation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

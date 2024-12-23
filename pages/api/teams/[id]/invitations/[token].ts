import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../lib/prisma';
import { hasTeamRole } from '../../../../../lib/boxyhq/utils';
import { Role } from '@prisma/client';
import type { Session } from 'next-auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return getInvitation(req, res);
    case 'POST':
      return acceptInvitation(req, res, session);
    case 'DELETE':
      return cancelInvitation(req, res, session);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

// Get invitation details
async function getInvitation(req: NextApiRequest, res: NextApiResponse) {
  const teamId = req.query.id as string;
  const token = req.query.token as string;

  try {
    const invitation = await prisma.invitation.findFirst({
      where: {
        token,
        teamId,
        expires: {
          gt: new Date(),
        },
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

    if (!invitation) {
      return res.status(404).json({ message: 'Invalid or expired invitation' });
    }

    return res.status(200).json(invitation);
  } catch (error) {
    console.error('Failed to fetch invitation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Accept invitation
async function acceptInvitation(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const teamId = req.query.id as string;
  const token = req.query.token as string;

  try {
    // Find valid invitation
    const invitation = await prisma.invitation.findFirst({
      where: {
        token,
        teamId,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!invitation) {
      return res.status(404).json({ message: 'Invalid or expired invitation' });
    }

    // Verify the invitation is for the current user
    if (invitation.email.toLowerCase() !== session.user.email.toLowerCase()) {
      return res.status(403).json({ message: 'This invitation is for a different user' });
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
      },
    });

    if (existingMember) {
      return res.status(400).json({ message: 'You are already a member of this team' });
    }

    // Accept invitation and add user to team
    const [member] = await prisma.$transaction([
      prisma.teamMember.create({
        data: {
          teamId,
          userId: session.user.id,
          role: invitation.role,
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
      }),
      prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' },
      }),
    ]);

    return res.status(200).json(member);
  } catch (error) {
    console.error('Failed to accept invitation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Cancel invitation (by team admin or invitee)
async function cancelInvitation(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const teamId = req.query.id as string;
  const token = req.query.token as string;

  try {
    const invitation = await prisma.invitation.findFirst({
      where: {
        token,
        teamId,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!invitation) {
      return res.status(404).json({ message: 'Invalid or expired invitation' });
    }

    // Check if user has permission to cancel
    const isAdmin = await hasTeamRole({
      teamId,
      userId: session.user.id,
      roles: [Role.ADMIN, Role.OWNER]
    });
    
    const isInvitee = invitation.email.toLowerCase() === session.user.email.toLowerCase();

    if (!isAdmin && !isInvitee) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Cancel invitation
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: 'CANCELLED' },
    });

    return res.status(200).json({ message: 'Invitation cancelled successfully' });
  } catch (error) {
    console.error('Failed to cancel invitation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

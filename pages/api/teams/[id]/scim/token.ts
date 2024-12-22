import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../lib/prisma';
import { hasTeamRole } from '../../../../../lib/boxyhq/utils';
import crypto from 'crypto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const teamId = req.query.id as string;

  switch (req.method) {
    case 'POST':
      return regenerateToken(req, res, session);
    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

// Regenerate SCIM token
async function regenerateToken(req: NextApiRequest, res: NextApiResponse, session: any) {
  const teamId = req.query.id as string;

  try {
    // Check if user has permission to regenerate token
    const hasPermission = await hasTeamRole({
      userId: session.user.id,
      teamId,
      roles: ['OWNER', 'ADMIN'],
    });

    if (!hasPermission) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.scimEnabled) {
      return res.status(400).json({ message: 'SCIM is not enabled for this team' });
    }

    // Generate new SCIM token
    const newToken = Buffer.from(crypto.randomBytes(32)).toString('hex');

    // Update team with new token
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        scimToken: newToken,
      },
      select: {
        id: true,
        scimEnabled: true,
        scimToken: true,
      },
    });

    return res.status(200).json(updatedTeam);
  } catch (error) {
    console.error('Failed to regenerate SCIM token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

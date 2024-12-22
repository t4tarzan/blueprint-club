import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../lib/prisma';
import { hasTeamRole } from '../../../../../lib/boxyhq/utils';

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
    case 'GET':
      return getSCIMConfig(req, res, session);
    case 'POST':
      return updateSCIMConfig(req, res, session);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

// Get SCIM configuration
async function getSCIMConfig(req: NextApiRequest, res: NextApiResponse, session: any) {
  const teamId = req.query.id as string;

  try {
    // Check if user has permission to view SCIM config
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
      select: {
        id: true,
        scimEnabled: true,
        scimToken: true,
      },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    return res.status(200).json(team);
  } catch (error) {
    console.error('Failed to fetch SCIM config:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update SCIM configuration
async function updateSCIMConfig(req: NextApiRequest, res: NextApiResponse, session: any) {
  const teamId = req.query.id as string;
  const { enabled } = req.body;

  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ message: 'Enabled status is required' });
  }

  try {
    // Check if user has permission to update SCIM config
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

    // Update SCIM configuration
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        scimEnabled: enabled,
        // Generate initial SCIM token if enabling SCIM
        ...(enabled && !team.scimToken
          ? { scimToken: Buffer.from(crypto.randomBytes(32)).toString('hex') }
          : {}),
      },
      select: {
        id: true,
        scimEnabled: true,
        scimToken: true,
      },
    });

    return res.status(200).json(updatedTeam);
  } catch (error) {
    console.error('Failed to update SCIM config:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

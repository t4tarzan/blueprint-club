import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';
import { hasTeamRole } from '../../../../lib/boxyhq/utils';
import { SAMLService } from '../../../../lib/boxyhq/saml-service';
import { emailService } from '../../../../lib/email';

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
      return getSAMLConfig(req, res, session);
    case 'POST':
      return updateSAMLConfig(req, res, session);
    case 'DELETE':
      return deleteSAMLConfig(req, res, session);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

// Get SAML configuration
async function getSAMLConfig(req: NextApiRequest, res: NextApiResponse, session: any) {
  const teamId = req.query.id as string;

  try {
    // Check if user has permission to view SAML config
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

    const samlService = SAMLService.getInstance();
    const connection = await samlService.getConnection(team.slug);

    return res.status(200).json(connection || null);
  } catch (error) {
    console.error('Failed to fetch SAML config:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update SAML configuration
async function updateSAMLConfig(req: NextApiRequest, res: NextApiResponse, session: any) {
  const teamId = req.query.id as string;
  const {
    encodedRawMetadata,
    redirectUrl,
    defaultRedirectUrl,
    tenant,
    product,
  } = req.body;

  if (!encodedRawMetadata) {
    return res.status(400).json({ message: 'SAML metadata is required' });
  }

  try {
    // Check if user has permission to update SAML config
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
      include: {
        members: {
          where: {
            role: {
              in: ['OWNER', 'ADMIN'],
            },
          },
          include: {
            user: true,
          },
        },
      },
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

    const samlService = SAMLService.getInstance();
    const connection = await samlService.createConnection({
      encodedRawMetadata,
      redirectUrl,
      defaultRedirectUrl,
      tenant: tenant || team.slug,
      product: product || process.env.BOXYHQ_ENTERPRISE_SLUG || 'blueprint-club',
    });

    // Send SSO configuration update notification to all owners and admins
    const adminEmails = team.members.map(member => member.user.email);
    await emailService.sendSSOConfigUpdateNotification(team, updater, adminEmails);

    return res.status(200).json(connection);
  } catch (error) {
    console.error('Failed to update SAML config:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete SAML configuration
async function deleteSAMLConfig(req: NextApiRequest, res: NextApiResponse, session: any) {
  const teamId = req.query.id as string;

  try {
    // Check if user has permission to delete SAML config
    const hasPermission = await hasTeamRole({
      userId: session.user.id,
      teamId,
      roles: ['OWNER'],
    });

    if (!hasPermission) {
      return res.status(403).json({ message: 'Only team owners can delete SAML configuration' });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const samlService = SAMLService.getInstance();
    await samlService.deleteConnection(team.slug);

    return res.status(204).end();
  } catch (error) {
    console.error('Failed to delete SAML config:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

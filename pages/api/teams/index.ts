import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';
import { generateTeamSlug } from '../../../lib/boxyhq/utils';

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
      return getTeams(req, res, session);
    case 'POST':
      return createTeam(req, res, session);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

// Get all teams for the current user
async function getTeams(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
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

    return res.status(200).json(teams);
  } catch (error) {
    console.error('Failed to fetch teams:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create a new team
async function createTeam(req: NextApiRequest, res: NextApiResponse, session: any) {
  const { name, domain } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Team name is required' });
  }

  try {
    // Check if domain is already in use
    if (domain) {
      const existingTeam = await prisma.team.findUnique({
        where: { domain },
      });

      if (existingTeam) {
        return res.status(400).json({ message: 'Domain is already in use' });
      }
    }

    // Generate a unique slug
    const slug = await generateTeamSlug(name);

    // Create team and add current user as owner
    const team = await prisma.team.create({
      data: {
        name,
        slug,
        domain,
        members: {
          create: {
            userId: session.user.id,
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

    return res.status(201).json(team);
  } catch (error) {
    console.error('Failed to create team:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

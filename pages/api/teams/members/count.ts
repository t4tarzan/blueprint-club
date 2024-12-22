import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const session = await getSession({ req });
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const count = await prisma.teamMember.count({
      where: {
        team: {
          createdById: session.user.id,
        },
      },
    });

    return res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting team member count:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

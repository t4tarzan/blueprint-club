import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkTeamMemberLimit } from '@/lib/subscription';
import { Role } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const teamId = req.query.id as string;

  try {
    switch (req.method) {
      case 'GET': {
        const members = await prisma.teamMember.findMany({
          where: { teamId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                subscription: true,
              },
            },
          },
        });

        return res.json(members);
      }

      case 'POST': {
        const { email, role = Role.MEMBER } = req.body;

        if (!email || !role) {
          return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if user has permission to add members
        const currentMember = await prisma.teamMember.findFirst({
          where: {
            teamId,
            userId: session.user.id,
            role: { in: [Role.ADMIN, Role.OWNER] },
          },
        });

        if (!currentMember) {
          return res.status(403).json({ message: 'Insufficient permissions' });
        }

        const team = await prisma.team.findUnique({
          where: { id: teamId },
          include: { members: true },
        });

        if (!team) {
          return res.status(404).json({ message: 'Team not found' });
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const canAddMember = await checkTeamMemberLimit(team.id);

        if (!canAddMember) {
          return res.status(403).json({
            message: 'Team member limit reached. Please upgrade your plan.',
          });
        }

        const existingMember = await prisma.teamMember.findFirst({
          where: {
            teamId,
            userId: user.id,
          },
        });

        if (existingMember) {
          return res.status(400).json({ message: 'User is already a member of this team' });
        }

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

        return res.json(member);
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling team members:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

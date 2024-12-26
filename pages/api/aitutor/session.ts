import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get current session or create new one
    let tutorSession = await prisma.tutorSession.findFirst({
      where: {
        userId: session.user.id,
        questionsLeft: { gt: 0 }
      },
      include: {
        questions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!tutorSession) {
      tutorSession = await prisma.tutorSession.create({
        data: {
          userId: session.user.id,
          questionsLeft: 20 // Give 20 questions per session
        },
        include: {
          questions: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      });
    }

    return res.status(200).json({
      questionsLeft: tutorSession.questionsLeft,
      recentQuestions: tutorSession.questions
    });

  } catch (error) {
    console.error('Session error:', error);
    return res.status(500).json({ 
      error: 'Failed to get or create session',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

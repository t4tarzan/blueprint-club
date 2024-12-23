import { NextApiRequest, NextApiResponse } from 'next';
import { WebhookService } from '@/lib/webhook/webhook-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { TeamService } from '@/lib/team-service';

const webhookService = WebhookService.getInstance();
const teamService = new TeamService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id: teamId, webhookId } = req.query;

  if (!teamId || !webhookId || Array.isArray(teamId) || Array.isArray(webhookId)) {
    return res.status(400).json({ message: 'Invalid team ID or webhook ID' });
  }

  const team = await teamService.findById(teamId);
  if (!team) {
    return res.status(404).json({ message: 'Team not found' });
  }

  const member = await teamService.findMember(teamId, session.user.id);
  if (!member) {
    return res.status(403).json({ message: 'Not a team member' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const deliveries = await webhookService.listDeliveries(webhookId, page);
    return res.status(200).json(deliveries);
  } catch (error) {
    console.error('Failed to list webhook deliveries:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

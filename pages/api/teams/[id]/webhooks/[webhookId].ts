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

  try {
    switch (req.method) {
      case 'GET':
        const webhook = await webhookService.get(webhookId);
        return res.status(200).json(webhook);

      case 'PUT':
        const updatedWebhook = await webhookService.update(webhookId, req.body);
        return res.status(200).json(updatedWebhook);

      case 'DELETE':
        await webhookService.delete(webhookId);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Webhook operation failed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

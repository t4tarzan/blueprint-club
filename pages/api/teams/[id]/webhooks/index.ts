import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { WebhookService } from '../../../../../lib/webhook/webhook-service';
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

  // Check if user has permission to manage webhooks
  const hasPermission = await hasTeamRole({
    userId: session.user.id,
    teamId,
    roles: ['OWNER', 'ADMIN'],
  });

  if (!hasPermission) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  const webhookService = WebhookService.getInstance();

  switch (req.method) {
    case 'GET':
      try {
        const webhooks = await webhookService.listWebhooks(teamId);
        return res.status(200).json(webhooks);
      } catch (error) {
        console.error('Error listing webhooks:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    case 'POST':
      try {
        const { url, description, events, isActive } = req.body;

        if (!url || !events || !Array.isArray(events)) {
          return res.status(400).json({ message: 'Invalid webhook data' });
        }

        const webhook = await webhookService.createWebhook(teamId, session.user.id, {
          url,
          description,
          events,
          isActive,
        });

        return res.status(201).json(webhook);
      } catch (error) {
        console.error('Error creating webhook:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

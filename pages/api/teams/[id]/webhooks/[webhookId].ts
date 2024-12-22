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
  const webhookId = req.query.webhookId as string;

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

  // Check if webhook exists and belongs to team
  const webhook = await webhookService.getWebhook(teamId, webhookId);
  if (!webhook) {
    return res.status(404).json({ message: 'Webhook not found' });
  }

  switch (req.method) {
    case 'GET':
      try {
        return res.status(200).json(webhook);
      } catch (error) {
        console.error('Error getting webhook:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    case 'PUT':
      try {
        const { url, description, events, isActive } = req.body;

        const updatedWebhook = await webhookService.updateWebhook(
          teamId,
          webhookId,
          session.user.id,
          {
            url,
            description,
            events,
            isActive,
          }
        );

        return res.status(200).json(updatedWebhook);
      } catch (error) {
        console.error('Error updating webhook:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    case 'DELETE':
      try {
        await webhookService.deleteWebhook(teamId, webhookId, session.user.id);
        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting webhook:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

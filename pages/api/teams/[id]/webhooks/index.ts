import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { WebhookService } from '@/lib/webhook/webhook-service';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { authOptions } from '@/lib/auth/config';

const webhookService = WebhookService.getInstance();

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

const webhookSchema = z.object({
  url: z.string().url('Invalid URL'),
  description: z.string().optional(),
  events: z.array(z.string()).min(1, 'At least one event must be selected'),
  isActive: z.boolean().optional(),
  secret: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await limiter.check(res, 10, req.socket.remoteAddress || 'unknown'); // 10 requests per minute per IP
  } catch {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const teamId = req.query.id as string;
  const team = session.user.teams.find((t) => t.id === teamId);
  if (!team) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  switch (req.method) {
    case 'GET':
      return handleGet(req, res, teamId);
    case 'POST':
      return handlePost(req, res, teamId);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string
) {
  try {
    const webhooks = await webhookService.getWebhooks(teamId);
    return res.status(200).json(webhooks);
  } catch (error) {
    console.error('Error getting webhooks:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string
) {
  try {
    const result = webhookSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: result.error.issues,
      });
    }

    const webhook = await webhookService.createWebhook({
      teamId,
      ...result.data,
      isActive: result.data.isActive ?? true,
    });

    return res.status(201).json(webhook);
  } catch (error) {
    console.error('Error creating webhook:', error);
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

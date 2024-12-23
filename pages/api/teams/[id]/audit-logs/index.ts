import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { AuditService } from '../../../../../lib/boxyhq/audit-service';
import { hasTeamRole } from '../../../../../lib/boxyhq/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const teamId = req.query.id as string;

  if (!teamId) {
    return res.status(400).json({ message: 'Team ID is required' });
  }

  // Check if user has access to the team
  const hasAccess = await hasTeamRole(session.user.id, teamId, ['ADMIN', 'MEMBER']);

  if (!hasAccess) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const auditService = AuditService.getInstance();

  switch (req.method) {
    case 'GET':
      const {
        category,
        action,
        status,
        startDate,
        endDate,
        page,
        limit,
      } = req.query;

      try {
        const result = await auditService.findByTeam(teamId, {
          page: page ? parseInt(page as string, 10) : undefined,
          limit: limit ? parseInt(limit as string, 10) : undefined,
          startDate: startDate ? (startDate as string) : undefined,
          endDate: endDate ? (endDate as string) : undefined,
        });

        return res.status(200).json(result);
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

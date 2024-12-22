import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { AuditService } from '../../../../../lib/boxyhq/audit-service';
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

  // Check if user has permission to view audit logs
  const hasPermission = await hasTeamRole({
    userId: session.user.id,
    teamId,
    roles: ['OWNER', 'ADMIN'],
  });

  if (!hasPermission) {
    return res.status(403).json({ message: 'Insufficient permissions' });
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
        const logs = await auditService.getLogs({
          teamId,
          category: category as any,
          action: action as any,
          status: status as any,
          startDate: startDate ? new Date(startDate as string) : undefined,
          endDate: endDate ? new Date(endDate as string) : undefined,
          page: page ? parseInt(page as string, 10) : undefined,
          limit: limit ? parseInt(limit as string, 10) : undefined,
        });

        return res.status(200).json(logs);
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

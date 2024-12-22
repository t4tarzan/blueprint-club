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

  // Check if user has permission to export audit logs
  const hasPermission = await hasTeamRole({
    userId: session.user.id,
    teamId,
    roles: ['OWNER', 'ADMIN'],
  });

  if (!hasPermission) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const auditService = AuditService.getInstance();
  const { startDate, endDate } = req.query;

  try {
    const csv = await auditService.exportLogs({
      teamId,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="audit-logs-${teamId}-${new Date().toISOString()}.csv"`
    );

    return res.status(200).send(csv);
  } catch (error) {
    console.error('Failed to export audit logs:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

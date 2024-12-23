import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { AuditService } from '@/lib/boxyhq/audit-service';
import { TeamService } from '@/lib/team-service';
import { createObjectCsvStringifier } from 'csv-writer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const teamId = req.query.id as string;
  const { startDate, endDate } = req.query;

  const teamService = new TeamService();
  const auditService = AuditService.getInstance();

  const team = await teamService.findById(teamId);
  if (!team) {
    return res.status(404).json({ message: 'Team not found' });
  }

  const member = await teamService.findMember(teamId, session.user.id);
  if (!member || !['OWNER', 'ADMIN'].includes(member.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const logs = await auditService.findByTeamAndAction(
    teamId,
    undefined,
    startDate as string | undefined,
    endDate as string | undefined
  );

  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'id', title: 'ID' },
      { id: 'action', title: 'Action' },
      { id: 'actorEmail', title: 'Actor Email' },
      { id: 'actorName', title: 'Actor Name' },
      { id: 'entityId', title: 'Entity ID' },
      { id: 'entityType', title: 'Entity Type' },
      { id: 'entityName', title: 'Entity Name' },
      { id: 'metadata', title: 'Metadata' },
      { id: 'createdAt', title: 'Created At' },
    ],
  });

  const records = logs.map((log) => ({
    id: log.id,
    action: log.action,
    actorEmail: log.actorEmail,
    actorName: log.actorName || '',
    entityId: log.entityId || '',
    entityType: log.entityType,
    entityName: log.entityName || '',
    metadata: JSON.stringify(log.metadata),
    createdAt: log.createdAt.toISOString(),
  }));

  const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${teamId}.csv`);
  res.status(200).send(csv);
}

import { NextApiRequest, NextApiResponse } from 'next';
import { SCIMProvider } from '../../../lib/boxyhq/scim-service';
import { prisma } from '../../../lib/prisma';

// SCIM API authentication middleware
const authenticateRequest = async (req: NextApiRequest) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Invalid authorization header');
  }

  const token = authHeader.split(' ')[1];
  const team = await prisma.team.findFirst({
    where: {
      scimToken: token,
    },
  });

  if (!team) {
    throw new Error('Invalid SCIM token');
  }

  return team;
};

// Parse SCIM path parameters
const parsePathParams = (path: string[]) => {
  const [resourceType, ...rest] = path;
  const resourceId = rest.length > 0 ? rest[0] : undefined;
  return { resourceType, resourceId };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Authenticate request
    const team = await authenticateRequest(req);

    // Get SCIM path parameters
    const path = req.query.path as string[];
    const { resourceType, resourceId } = parsePathParams(path);

    // Initialize SCIM provider
    const scimProvider = SCIMProvider.getInstance();

    // Handle SCIM endpoints
    switch (resourceType) {
      case 'Users':
        await handleUsersEndpoint(req, res, team.id, resourceId, scimProvider);
        break;

      case 'Groups':
        await handleGroupsEndpoint(req, res, team.id, resourceId, scimProvider);
        break;

      default:
        res.status(404).json({ error: 'Resource type not supported' });
    }
  } catch (error: any) {
    console.error('SCIM API error:', error);
    
    if (error.message === 'Invalid authorization header' || error.message === 'Invalid SCIM token') {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// Handle Users endpoints
async function handleUsersEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string,
  userId: string | undefined,
  scimProvider: SCIMProvider
) {
  switch (req.method) {
    case 'GET':
      if (userId) {
        const user = await scimProvider.getUser(teamId, userId);
        if (!user) {
          res.status(404).json({ error: 'User not found' });
        } else {
          res.status(200).json(user);
        }
      } else {
        const users = await scimProvider.listUsers(teamId, req.query);
        res.status(200).json(users);
      }
      break;

    case 'POST':
      const newUser = await scimProvider.createUser(teamId, req.body);
      res.status(201).json(newUser);
      break;

    case 'PUT':
      if (!userId) {
        res.status(400).json({ error: 'User ID required' });
        return;
      }
      const updatedUser = await scimProvider.updateUser(teamId, userId, req.body);
      res.status(200).json(updatedUser);
      break;

    case 'PATCH':
      if (!userId) {
        res.status(400).json({ error: 'User ID required' });
        return;
      }
      // Handle PATCH operations (not implemented in this example)
      res.status(501).json({ error: 'PATCH not implemented' });
      break;

    case 'DELETE':
      if (!userId) {
        res.status(400).json({ error: 'User ID required' });
        return;
      }
      await scimProvider.deleteUser(teamId, userId);
      res.status(204).end();
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}

// Handle Groups endpoints
async function handleGroupsEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: string,
  groupId: string | undefined,
  scimProvider: SCIMProvider
) {
  switch (req.method) {
    case 'GET':
      if (groupId) {
        const group = await scimProvider.getGroup(teamId, groupId);
        if (!group) {
          res.status(404).json({ error: 'Group not found' });
        } else {
          res.status(200).json(group);
        }
      } else {
        const groups = await scimProvider.listGroups(teamId, req.query);
        res.status(200).json(groups);
      }
      break;

    case 'POST':
      const newGroup = await scimProvider.createGroup(teamId, req.body);
      res.status(201).json(newGroup);
      break;

    case 'PUT':
      if (!groupId) {
        res.status(400).json({ error: 'Group ID required' });
        return;
      }
      const updatedGroup = await scimProvider.updateGroup(teamId, groupId, req.body);
      res.status(200).json(updatedGroup);
      break;

    case 'PATCH':
      if (!groupId) {
        res.status(400).json({ error: 'Group ID required' });
        return;
      }
      // Handle PATCH operations (not implemented in this example)
      res.status(501).json({ error: 'PATCH not implemented' });
      break;

    case 'DELETE':
      if (!groupId) {
        res.status(400).json({ error: 'Group ID required' });
        return;
      }
      await scimProvider.deleteGroup(teamId, groupId);
      res.status(204).end();
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}

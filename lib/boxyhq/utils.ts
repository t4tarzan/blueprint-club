import { prisma } from '../prisma';
import { Role, Team, User, TeamMember } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

/**
 * Get team from domain or session
 */
export async function getTeamFromContext(
  context: GetServerSidePropsContext
): Promise<Team | null> {
  const session = await getSession(context);
  if (!session?.user?.id) {
    return null;
  }

  const teamMember = await prisma.teamMember.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      team: true,
    },
  });

  return teamMember?.team || null;
}

/**
 * Check if user has required role in team
 */
export async function hasTeamRole(
  userId: string,
  teamId: string,
  roles?: Role[]
): Promise<boolean>;
export async function hasTeamRole(params: {
  userId: string;
  teamId: string;
  roles?: Role[];
}): Promise<boolean>;
export async function hasTeamRole(
  userIdOrParams: string | { userId: string; teamId: string; roles?: Role[] },
  teamId?: string,
  roles?: Role[]
): Promise<boolean> {
  let userId: string;
  let teamIdToUse: string;
  let rolesToCheck: Role[] | undefined;

  if (typeof userIdOrParams === 'string') {
    userId = userIdOrParams;
    teamIdToUse = teamId!;
    rolesToCheck = roles;
  } else {
    userId = userIdOrParams.userId;
    teamIdToUse = userIdOrParams.teamId;
    rolesToCheck = userIdOrParams.roles;
  }

  const query: any = {
    userId,
    teamId: teamIdToUse,
  };

  if (rolesToCheck && rolesToCheck.length > 0) {
    query.role = {
      in: rolesToCheck,
    };
  }

  const teamMember = await prisma.teamMember.findFirst({
    where: query,
  });

  return !!teamMember;
}

/**
 * Validate SAML config
 */
export function validateSAMLConfig(config: {
  acsUrl: string;
  entityId: string;
  idpUrl: string;
  certificate: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.acsUrl) {
    errors.push('ACS URL is required');
  } else if (!isValidUrl(config.acsUrl)) {
    errors.push('Invalid ACS URL');
  }

  if (!config.entityId) {
    errors.push('Entity ID is required');
  } else if (!isValidUrl(config.entityId)) {
    errors.push('Invalid Entity ID');
  }

  if (!config.idpUrl) {
    errors.push('IdP URL is required');
  } else if (!isValidUrl(config.idpUrl)) {
    errors.push('Invalid IdP URL');
  }

  if (!config.certificate) {
    errors.push('Certificate is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format SAML configuration for display
 */
export function formatSAMLConfig(config: {
  acsUrl: string;
  entityId: string;
  idpUrl: string;
  certificate: string;
}): {
  acsUrl: string;
  entityId: string;
  idpUrl: string;
  certificate: string;
} {
  return {
    acsUrl: config.acsUrl || '',
    entityId: config.entityId || '',
    idpUrl: config.idpUrl || '',
    certificate: config.certificate || '',
  };
}

/**
 * Generate a slug for a team name
 */
export function generateTeamSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

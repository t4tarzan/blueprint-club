import { prisma } from '../prisma';
import type { Team, User } from '@prisma/client';

/**
 * Get team slug from domain
 */
export function getTeamSlugFromDomain(hostname: string): string | null {
  // Remove port if present
  const domain = hostname.split(':')[0];
  
  // Check if it's a custom domain
  if (!domain.includes('localhost') && !domain.includes('.vercel.app')) {
    return domain;
  }
  
  return null;
}

/**
 * Get team from domain or session
 */
export async function getTeamFromContext(params: {
  domain?: string | null;
  userId?: string | null;
}): Promise<Team | null> {
  const { domain, userId } = params;

  if (domain) {
    return prisma.team.findUnique({
      where: { domain },
    });
  }

  if (userId) {
    const teamMember = await prisma.teamMember.findFirst({
      where: { userId },
      include: { team: true },
      orderBy: { createdAt: 'asc' },
    });
    return teamMember?.team || null;
  }

  return null;
}

/**
 * Check if user has required role in team
 */
export async function hasTeamRole(params: {
  userId: string;
  teamId: string;
  roles: string[];
}): Promise<boolean> {
  const { userId, teamId, roles } = params;

  const teamMember = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });

  return teamMember ? roles.includes(teamMember.role) : false;
}

/**
 * Get user's teams with roles
 */
export async function getUserTeams(userId: string) {
  const teamMembers = await prisma.teamMember.findMany({
    where: { userId },
    include: { team: true },
  });

  return teamMembers.map(({ team, role }) => ({
    ...team,
    role,
  }));
}

/**
 * Format SAML configuration for display
 */
export function formatSAMLConfig(config: any) {
  return {
    entityId: config.entityId || '',
    acsUrl: config.acsUrl || '',
    idpUrl: config.idpUrl || '',
    certificate: config.certificate || '',
  };
}

/**
 * Validate SAML configuration
 */
export function validateSAMLConfig(config: any): string | null {
  const required = ['entityId', 'acsUrl', 'idpUrl', 'certificate'];
  const missing = required.filter(field => !config[field]);
  
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }

  return null;
}

/**
 * Generate team slug from name
 */
export async function generateTeamSlug(name: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  let slug = baseSlug;
  let counter = 1;

  while (await prisma.team.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get current session
    const session = await getServerSession(req, res, authOptions);
    
    // Get SAML profile from query params
    const profile = JSON.parse(decodeURIComponent(req.query.profile as string));
    
    if (!profile.email) {
      throw new Error('No email provided in SAML response');
    }

    // Find or create user
    const user = await prisma.user.upsert({
      where: { email: profile.email },
      update: {
        name: profile.name,
        emailVerified: new Date(), // SAML authenticated users are verified
      },
      create: {
        email: profile.email,
        name: profile.name,
        emailVerified: new Date(),
      },
    });

    // If tenant/team info is provided in SAML response
    if (profile.tenant) {
      const team = await prisma.team.upsert({
        where: { slug: profile.tenant },
        update: {},
        create: {
          name: profile.tenant,
          slug: profile.tenant,
        },
      });

      // Add user to team if not already a member
      await prisma.teamMember.upsert({
        where: {
          teamId_userId: {
            teamId: team.id,
            userId: user.id,
          },
        },
        update: {},
        create: {
          teamId: team.id,
          userId: user.id,
          role: 'MEMBER',
        },
      });
    }

    // Redirect to callback URL or dashboard
    const callbackUrl = session?.user ? '/dashboard' : '/auth/signin';
    res.redirect(302, callbackUrl);
  } catch (error) {
    console.error('SAML Callback error:', error);
    res.redirect(302, '/auth/error?error=SAMLError');
  }
}

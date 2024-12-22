import NextAuth, { NextAuthOptions } from 'next-auth';
import { compare } from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';

async function getTeamFromContext({ userId, domain }: { userId: string; domain: string | null }) {
  if (!userId) return null;

  const userTeams = await prisma.teamMember.findFirst({
    where: {
      userId,
      team: domain ? { domain } : undefined,
    },
    include: {
      team: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return userTeams?.team || null;
}

// Initialize providers
const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Please enter your email and password');
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
        include: {
          teamMembers: {
            include: {
              team: true,
            },
          },
        },
      });

      if (!user || !user.password) {
        throw new Error('Invalid email or password');
      }

      const isValid = await compare(credentials.password, user.password);

      if (!isValid) {
        // Update login attempts
        await prisma.user.update({
          where: { id: user.id },
          data: {
            invalid_login_attempts: {
              increment: 1,
            },
            lockedAt: user.invalid_login_attempts + 1 >= 5 ? new Date() : null,
          },
        });

        throw new Error('Invalid email or password');
      }

      // Check if account is locked
      if (user.lockedAt && user.lockedAt > new Date(Date.now() - 30 * 60 * 1000)) {
        throw new Error('Account is locked. Please try again later.');
      }

      // Auto verify email for now (remove this in production)
      if (!user.emailVerified) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
          },
        });
      }

      // Reset login attempts on successful login
      await prisma.user.update({
        where: { id: user.id },
        data: {
          invalid_login_attempts: 0,
          lockedAt: null,
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name || '',
        image: user.image || null,
        emailVerified: true, // Set this to true since we're auto-verifying
        membershipTier: 'FREE',
        teams: user.teamMembers.map(member => ({
          id: member.team.id,
          name: member.team.name,
          role: member.role,
        })),
      };
    },
  }),
];

export const authOptions: NextAuthOptions = {
  providers,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  callbacks: {
    async signIn({ user, account }) {
      // Check for account lockout
      if (user.lockedAt) {
        const lockoutDuration = 30 * 60 * 1000; // 30 minutes
        if (new Date().getTime() - new Date(user.lockedAt).getTime() < lockoutDuration) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.emailVerified = true; // Set this to true since we're auto-verifying
        token.membershipTier = user.membershipTier || 'FREE';
        token.teams = user.teams;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.emailVerified = true; // Set this to true since we're auto-verifying
        session.user.membershipTier = token.membershipTier as string;
        session.user.teams = token.teams as any[];

        // Add team context if available
        const team = await getTeamFromContext({
          userId: session.user.id,
          domain: typeof window !== 'undefined' ? window.location.hostname : null,
        });
        if (team) {
          session.user.currentTeam = team;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after sign in
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (isNewUser) {
        // Create default team for new users
        await prisma.team.create({
          data: {
            name: account?.provider === 'google' ? account.id : 'Default Team',
            slug: account?.provider === 'google' ? account.id : `team-${user.id}`,
            members: {
              create: {
                userId: user.id,
                role: 'OWNER',
              },
            },
          },
        });
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
};

export default NextAuth(authOptions);

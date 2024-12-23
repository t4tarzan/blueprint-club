import { AuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import CredentialsProvider from 'next-auth/providers/credentials';
import { BoxyHQSAMLProvider } from './providers/boxyhq-saml';
import { verifyPassword } from '../utils';
import { env } from '@/env.mjs';

export interface AuthUser extends User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: Date | null;
  membershipTier: string;
  teams: {
    id: string;
    name: string;
    slug: string;
    role: Role;
  }[];
}

export interface ExtendedSession extends Session {
  user: AuthUser;
}

export const COOKIE_NAME = 'next-auth.session-token';
export const CSRF_COOKIE_NAME = 'next-auth.csrf-token';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  providers: [
    BoxyHQSAMLProvider,
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            teams: {
              include: {
                team: true,
              },
            },
          },
        });

        if (!user) {
          throw new Error('User not found');
        }

        if (!user.password) {
          throw new Error('Please use the login method you used to create your account');
        }

        if (user.invalid_login_attempts >= 5 && user.lockedAt) {
          const lockoutPeriod = 30 * 60 * 1000; // 30 minutes
          const now = new Date();
          const lockoutEnd = new Date(user.lockedAt.getTime() + lockoutPeriod);

          if (now < lockoutEnd) {
            throw new Error('Account locked. Please try again later');
          }

          // Reset lockout if period has passed
          await prisma.user.update({
            where: { id: user.id },
            data: {
              invalid_login_attempts: 0,
              lockedAt: null,
            },
          });
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          // Increment invalid login attempts
          const invalid_login_attempts = (user.invalid_login_attempts || 0) + 1;
          const lockedAt = invalid_login_attempts >= 5 ? new Date() : null;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              invalid_login_attempts,
              lockedAt,
            },
          });

          throw new Error('Invalid password');
        }

        // Reset invalid login attempts on successful login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            invalid_login_attempts: 0,
            lockedAt: null,
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
          membershipTier: user.membershipTier,
          teams: user.teams.map((membership) => ({
            id: membership.team.id,
            name: membership.team.name,
            slug: membership.team.slug,
            role: membership.role,
          })),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session) {
        return { ...token, ...session.user };
      }

      if (!user) {
        return token;
      }

      return {
        ...token,
        ...user,
      };
    },
    async session({ session, token }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          image: token.image as string | null,
          emailVerified: token.emailVerified as Date | null,
          membershipTier: token.membershipTier as string,
          teams: token.teams as {
            id: string;
            name: string;
            slug: string;
            role: Role;
          }[],
        },
      };
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (isNewUser) {
        // Handle new user signup
      }
    },
  },
  secret: env.NEXTAUTH_SECRET,
};

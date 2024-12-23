import { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '../prisma';
import { Role } from '@/lib/types';

export interface Team {
  id: string;
  name: string;
  role: Role;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: Date | null;
  membershipTier: string;
  teams?: Team[];
  currentTeam?: Team;
}

export const adapter = PrismaAdapter(prisma);

// Rate limiting configuration
const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10);
const LOGIN_ATTEMPT_WINDOW = parseInt(process.env.LOGIN_ATTEMPT_WINDOW || '300', 10);

export const authOptions: AuthOptions = {
  adapter,
  providers: [
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

        // Check for account lockout
        if (user.lockedAt && user.lockedAt > new Date(Date.now() - LOGIN_ATTEMPT_WINDOW * 1000)) {
          throw new Error('Account is temporarily locked. Please try again later.');
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          // Increment failed login attempts
          await prisma.user.update({
            where: { id: user.id },
            data: {
              invalid_login_attempts: {
                increment: 1,
              },
              lockedAt: user.invalid_login_attempts + 1 >= MAX_LOGIN_ATTEMPTS
                ? new Date()
                : null,
            },
          });

          throw new Error('Invalid email or password');
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email before signing in');
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
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
          teams: user.teamMembers.map(member => ({
            id: member.team.id,
            name: member.team.name,
            role: member.role,
          })),
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
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
        session.user.teams = token.teams as any[];
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith('/')) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

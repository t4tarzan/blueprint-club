import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/auth/password';
import { Role } from '@/lib/types';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
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
          console.log('User not found');
          return null;
        }

        const isValid = await comparePassword(credentials.password, user.password);

        if (!isValid) {
          console.log('Invalid password');
          return null;
        }

        console.log('User authenticated:', user.email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: new Date(),
          membershipTier: user.membershipTier || 'free',
          teams: user.teams.map((membership) => ({
            id: membership.team.id,
            name: membership.team.name,
            role: membership.role as Role,
          })),
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.emailVerified = new Date();
        token.membershipTier = user.membershipTier || 'free';
        token.teams = user.teams;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        session.user.emailVerified = new Date();
        session.user.membershipTier = token.membershipTier as string;
        session.user.teams = token.teams as any[];
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
};

export default NextAuth(authOptions);

import NextAuth, { NextAuthOptions } from 'next-auth';
import { compare } from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../../lib/prisma';
import { CustomPrismaAdapter } from '../../../lib/auth/prismaAdapter';

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(prisma),
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
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email before signing in');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || '',
          image: user.image || null,
          emailVerified: user.emailVerified || null,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || '';
        token.picture = user.image || null;
        token.emailVerified = user.emailVerified || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name || '';
        session.user.image = token.picture || null;
        session.user.emailVerified = token.emailVerified || null;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        if (url.includes('/auth/verify')) {
          return url;
        }
        return `${baseUrl}/social`;
      }
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

export default NextAuth(authOptions);

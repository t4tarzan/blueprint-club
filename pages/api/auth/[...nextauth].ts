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
    newUser: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || '';
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string | null;
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
}

export default NextAuth(authOptions);

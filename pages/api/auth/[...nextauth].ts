import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/auth';
import { Role } from '@/lib/types/prisma';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
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

interface ExtendedSession {
  user: AuthUser;
  expires: string;
}

interface ExtendedJWT {
  user: AuthUser;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            teams: {
              include: {
                team: true,
              },
            },
          },
        });

        if (!user || !user.password) {
          console.log('User not found or no password');
          return null;
        }

        const isValid = await comparePassword(credentials.password, user.password);

        if (!isValid) {
          console.log('Invalid password');
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
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
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }): Promise<JWT & { user: AuthUser }> {
      if (user) {
        token.user = user as AuthUser;
      }
      return token as JWT & { user: AuthUser };
    },
    async session({ session, token }): Promise<ExtendedSession> {
      return {
        ...session,
        user: token.user,
      };
    },
  },
  pages: {
    signIn: '/',
    error: '/?error=true',
    signOut: '/?signout=true',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);

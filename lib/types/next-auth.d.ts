import { Role } from '@prisma/client';
import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string | null;
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
    };
  }

  interface User {
    id: string;
    name: string | null;
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
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
    picture: string | null;
    sub: string;
    membershipTier: string;
    emailVerified: Date | null;
    teams: {
      id: string;
      name: string;
      slug: string;
      role: Role;
    }[];
  }
}

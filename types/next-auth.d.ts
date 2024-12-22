import 'next-auth';
import { User, Team, Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      emailVerified: Date | null;
      teams?: {
        id: string;
        name: string;
        role: Role;
      }[];
      currentTeam?: Team;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    emailVerified: Date | null;
    teams?: {
      id: string;
      name: string;
      role: Role;
    }[];
    invalid_login_attempts?: number;
    lockedAt?: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    emailVerified: Date | null;
    teams?: {
      id: string;
      name: string;
      role: Role;
    }[];
    saml?: boolean;
    tenant?: string;
  }
}

// Extend the built-in session type
declare module 'next' {
  interface NextApiRequest {
    session?: Session;
  }
}

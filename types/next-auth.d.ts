import 'next-auth';
import { User } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      emailVerified: Date | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    emailVerified: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
    picture: string | null;
    emailVerified: Date | null;
  }
}

import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      emailVerified: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    emailVerified: boolean;
  }
}

import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter, AdapterUser, VerificationToken } from "next-auth/adapters";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  return {
    createUser: async (data) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name ?? "",
          image: data.image,
          emailVerified: data.emailVerified,
        },
      });
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image || null,
        emailVerified: user.emailVerified || null,
      } as AdapterUser;
    },
    getUser: async (id) => {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image || null,
        emailVerified: user.emailVerified || null,
      } as AdapterUser;
    },
    getUserByEmail: async (email) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image || null,
        emailVerified: user.emailVerified || null,
      } as AdapterUser;
    },
    getUserByAccount: async ({ providerAccountId, provider }) => {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        include: { user: true },
      });
      if (!account) return null;
      const { user } = account;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image || null,
        emailVerified: user.emailVerified || null,
      } as AdapterUser;
    },
    updateUser: async (data) => {
      const user = await prisma.user.update({
        where: { id: data.id },
        data: {
          name: data.name ?? "",
          email: data.email,
          image: data.image,
          emailVerified: data.emailVerified,
        },
      });
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image || null,
        emailVerified: user.emailVerified || null,
      } as AdapterUser;
    },
    deleteUser: async (userId) => {
      await prisma.user.delete({ where: { id: userId } });
    },
    linkAccount: async (data) => {
      await prisma.account.create({
        data: {
          userId: data.userId,
          type: data.type,
          provider: data.provider,
          providerAccountId: data.providerAccountId,
          refresh_token: data.refresh_token,
          access_token: data.access_token,
          expires_at: data.expires_at,
          token_type: data.token_type,
          scope: data.scope,
          id_token: data.id_token,
          session_state: data.session_state,
        },
      });
    },
    unlinkAccount: async ({ providerAccountId, provider }) => {
      await prisma.account.delete({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
      });
    },
    createSession: async (data) => {
      const session = await prisma.session.create({
        data: {
          userId: data.userId,
          expires: data.expires,
          sessionToken: data.sessionToken,
        },
      });
      return session;
    },
    getSessionAndUser: async (sessionToken) => {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!session) return null;
      const { user } = session;
      return {
        session: {
          userId: session.userId,
          expires: session.expires,
          sessionToken: session.sessionToken,
        },
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image || null,
          emailVerified: user.emailVerified || null,
        } as AdapterUser,
      };
    },
    updateSession: async (data) => {
      const session = await prisma.session.update({
        where: { sessionToken: data.sessionToken },
        data: {
          expires: data.expires,
        },
      });
      return session;
    },
    deleteSession: async (sessionToken) => {
      await prisma.session.delete({ where: { sessionToken } });
    },
    createVerificationToken: async (data) => {
      const verificationToken = await prisma.verificationToken.create({
        data: {
          identifier: data.identifier,
          token: data.token,
          expires: data.expires,
        },
      });
      return {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: verificationToken.expires,
      } as VerificationToken;
    },
    useVerificationToken: async (data) => {
      try {
        const verificationToken = await prisma.verificationToken.delete({
          where: {
            identifier_token: {
              identifier: data.identifier,
              token: data.token,
            },
          },
        });
        return verificationToken ? {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
          expires: verificationToken.expires,
        } as VerificationToken : null;
      } catch {
        return null;
      }
    },
  };
}

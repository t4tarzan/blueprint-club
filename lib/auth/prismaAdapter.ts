import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter } from "next-auth/adapters";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  const adapter = PrismaAdapter(prisma);
  return {
    ...adapter,
    createUser: async (data) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          image: data.image,
          emailVerified: data.emailVerified,
        },
      });
      return {
        id: user.id,
        email: user.email,
        name: user.name || null,
        image: user.image || null,
        emailVerified: user.emailVerified || null,
      };
    },
    getUser: async (id) => {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name || null,
        image: user.image || null,
        emailVerified: user.emailVerified || null,
      };
    },
    getUserByEmail: async (email) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name || null,
        image: user.image || null,
        emailVerified: user.emailVerified || null,
      };
    },
    updateUser: async (data) => {
      const user = await prisma.user.update({
        where: { id: data.id },
        data: {
          name: data.name,
          email: data.email,
          image: data.image,
          emailVerified: data.emailVerified,
        },
      });
      return {
        id: user.id,
        email: user.email,
        name: user.name || null,
        image: user.image || null,
        emailVerified: user.emailVerified || null,
      };
    },
  };
}

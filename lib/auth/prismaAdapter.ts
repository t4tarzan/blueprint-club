import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter, AdapterUser } from "next-auth/adapters";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  const adapter = PrismaAdapter(prisma);
  return {
    ...adapter,
    createUser: async (data) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name ?? "",  // Ensure name is never null
          image: data.image,
          emailVerified: data.emailVerified,
        },
      });
      return {
        id: user.id,
        email: user.email,
        name: user.name,  // Remove null fallback
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
        name: user.name,  // Remove null fallback
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
        name: user.name,  // Remove null fallback
        image: user.image || null,
        emailVerified: user.emailVerified || null,
      } as AdapterUser;
    },
    updateUser: async (data) => {
      const user = await prisma.user.update({
        where: { id: data.id },
        data: {
          name: data.name ?? "",  // Ensure name is never null
          email: data.email,
          image: data.image,
          emailVerified: data.emailVerified,
        },
      });
      return {
        id: user.id,
        email: user.email,
        name: user.name,  // Remove null fallback
        image: user.image || null,
        emailVerified: user.emailVerified || null,
      } as AdapterUser;
    },
  };
}

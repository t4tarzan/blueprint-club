import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const { hash } = bcryptjs;

async function hashPassword(password) {
  return hash(password, 12);
}

async function createUser() {
  try {
    const hashedPassword = await hashPassword('Password123!');
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        membershipTier: 'free'
      }
    });
    console.log('Created user:', user);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();

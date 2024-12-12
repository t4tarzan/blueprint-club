import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { sendVerificationEmail } from '../../../lib/email';
import crypto from 'crypto';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;
    console.log('Starting signup process for:', email);

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    try {
      // Create user and verification token in a transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Create user
        const user = await prisma.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
            emailVerified: null,
          },
        });

        // Create verification token
        const verificationToken = await prisma.verificationToken.create({
          data: {
            token: crypto.randomBytes(32).toString('hex'),
            email: user.email,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
          },
        });

        return { user, verificationToken };
      });

      console.log('User created successfully:', result.user.id);
      
      // Send verification email
      try {
        await sendVerificationEmail(email, result.verificationToken.token);
        console.log('Verification email sent to:', email);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't delete the user, just log the error
        console.log('User created but verification email failed to send');
      }

      return res.status(201).json({
        message: 'User created successfully. Please check your email for verification.',
      });

    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      throw dbError;
    }

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      message: 'Error creating user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { defaultHeaders } from '@/lib/common';
import { emailService } from '@/lib/email';
import type { ApiError } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (req.method === 'POST') {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Create reset token
      const resetToken = await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: require('crypto').randomBytes(32).toString('hex'),
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      // Send reset email
      await emailService.sendPasswordResetEmail(email, resetToken.token);

      return res.status(200).json({ message: 'Password reset email sent' });
    } else if (req.method === 'PUT') {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Verify token
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
      });

      if (!verificationToken) {
        return res.status(400).json({ message: 'Invalid token' });
      }

      if (verificationToken.expires < new Date()) {
        await prisma.verificationToken.delete({
          where: { token },
        });
        return res.status(400).json({ message: 'Token expired' });
      }

      // Update password
      const hashedPassword = await hash(password, 10);
      await prisma.user.update({
        where: { email: verificationToken.identifier },
        data: { password: hashedPassword },
      });

      // Delete used token
      await prisma.verificationToken.delete({
        where: { token },
      });

      return res.status(200).json({ message: 'Password updated successfully' });
    }
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

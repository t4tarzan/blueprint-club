import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../../../lib/email';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // Request password reset
    try {
      const { email } = req.body;
      console.log('Reset password request received for:', email);
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email },
      }).catch(err => {
        console.error('Database error when finding user:', err);
        throw err;
      });

      console.log('User lookup result:', user ? 'Found' : 'Not found');

      if (!user) {
        console.log('No user found with email:', email);
        // Don't reveal if user exists
        return res.status(200).json({ message: 'If an account exists, a password reset email has been sent' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      console.log('Generated reset token:', resetToken.substring(0, 8) + '...');

      try {
        // Store reset token
        const savedToken = await prisma.verificationToken.upsert({
          where: { email: user.email },
          update: {
            token: resetToken,
            expires,
          },
          create: {
            email: user.email,
            token: resetToken,
            expires,
          },
        }).catch(err => {
          console.error('Database error when upserting token:', err);
          throw err;
        });

        console.log('Successfully saved verification token with ID:', savedToken.id);

        // Send reset email
        console.log('Attempting to send reset email...');
        await sendPasswordResetEmail(email, resetToken).catch(err => {
          console.error('Email sending error:', err);
          throw err;
        });
        console.log('Reset email sent successfully');

        return res.status(200).json({ message: 'Password reset email sent' });
      } catch (innerError) {
        console.error('Detailed inner error:', innerError);
        throw innerError;
      }
    } catch (error) {
      console.error('Reset password request error:', error);
      return res.status(500).json({ 
        message: 'Error processing request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
  } else if (req.method === 'PUT') {
    // Reset password with token
    try {
      const { token, password } = req.body;

      // Verify token
      const verificationToken = await prisma.verificationToken.findFirst({
        where: {
          token,
          expires: { gt: new Date() },
        },
      });

      if (!verificationToken) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // Hash new password
      const hashedPassword = await hash(password, 10);

      // Update user password and verify email
      await prisma.user.update({
        where: { email: verificationToken.email },
        data: {
          password: hashedPassword,
          emailVerified: new Date(),
        },
      });

      // Delete used token
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      });

      return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(500).json({ message: 'Error resetting password' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

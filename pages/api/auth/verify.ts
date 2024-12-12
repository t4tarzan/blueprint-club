import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { compare } from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: token,
        expires: { gt: new Date() }
      }
    });

    if (!verificationToken) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update user
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { 
        emailVerified: new Date(),
      }
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id }
    });

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ message: 'Error verifying email' });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get token from query params (GET) or request body (POST)
    const token = req.method === 'GET' 
      ? req.query.token 
      : req.body.token;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Invalid token' });
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token },
      });
      return res.status(400).json({ error: 'Token has expired' });
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    if (req.method === 'GET') {
      // Redirect to success page for GET requests
      res.redirect(307, '/auth/verify-success');
    } else {
      // Return JSON response for POST requests
      return res.status(200).json({ 
        success: true,
        message: 'Email verified successfully'
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ error: 'Failed to verify email' });
  }
}

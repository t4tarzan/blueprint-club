import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { defaultHeaders } from '@/lib/common';
import { emailService } from '@/lib/email';
import type { ApiError } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, password, team } = req.body;

    if (!email || !password || !team) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    try {
      // Use transaction to ensure all operations succeed or fail together
      const result = await prisma.$transaction(async (tx) => {
        // Create user first
        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            membershipTier: 'FREE',
          },
        });

        // Create team
        const newTeam = await tx.team.create({
          data: {
            name: team,
            slug: team.toLowerCase().replace(/\s+/g, '-'),
          },
        });

        // Create team membership
        const teamMember = await tx.teamMember.create({
          data: {
            teamId: newTeam.id,
            userId: user.id,
            role: 'ADMIN',
          },
        });

        // Create verification token
        const token = await tx.verificationToken.create({
          data: {
            identifier: email,
            token: require('crypto').randomBytes(32).toString('hex'),
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          },
        });

        return { user, team: newTeam, teamMember, token };
      });

      // Send verification email
      await emailService.sendVerificationEmail(result.user.email, result.token.token);

      res.status(200).json({ message: 'User created successfully' });
    } catch (txError: any) {
      console.error('Transaction error:', txError);
      res.status(500).json({ message: 'Internal server error' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

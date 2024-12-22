import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { sendVerificationEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password, team } = req.body;
    console.log('Registration attempt:', { name, email, team });

    if (!name || !email || !password || !team) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token expires in 24 hours

    // Hash password
    const hashedPassword = await hash(password, 12);
    console.log('Password hashed successfully');

    try {
      // Use transaction to ensure all operations succeed or fail together
      const result = await prisma.$transaction(async (tx) => {
        // Create user first
        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });
        console.log('User created:', { id: user.id, email: user.email });

        // Create team
        const newTeam = await tx.team.create({
          data: {
            name: team,
            slug: team.toLowerCase().replace(/\s+/g, '-'),
          },
        });
        console.log('Team created:', newTeam);

        // Create team membership
        const teamMember = await tx.teamMember.create({
          data: {
            teamId: newTeam.id,
            userId: user.id,
            role: Role.ADMIN,
          },
        });
        console.log('Team membership created:', teamMember);

        // Create verification token
        const verificationRecord = await tx.verificationToken.create({
          data: {
            token: verificationToken,
            email: user.email,
            expires: tokenExpiry,
          },
        });
        console.log('Verification token created');

        return { user, team: newTeam, teamMember, verificationRecord };
      });

      // Send verification email
      await sendVerificationEmail(result.user.email, verificationToken);
      console.log('Verification email sent');

      return res.status(200).json({ 
        success: true,
        message: 'Registration successful. Please check your email to verify your account.'
      });
    } catch (txError: any) {
      console.error('Transaction error:', txError);
      return res.status(500).json({ error: 'Database transaction failed: ' + txError.message });
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to create account: ' + error.message });
  }
}

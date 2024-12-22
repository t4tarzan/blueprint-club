import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Try to connect to the database
    await prisma.$connect();
    
    // Get user count as a test
    const userCount = await prisma.user.count();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Database connected successfully',
      userCount 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error)
    });
  } finally {
    await prisma.$disconnect();
  }
}

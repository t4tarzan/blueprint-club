import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    // Log the raw session data
    console.log('Session data:', JSON.stringify(session, null, 2));
    
    // Set proper headers
    res.setHeader('Content-Type', 'application/json');
    
    return res.status(200).json({
      ok: true,
      session,
      headers: req.headers,
      cookies: req.cookies,
    });
  } catch (error) {
    console.error('Session error:', error);
    return res.status(500).json({ 
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Testing email with Resend API Key:', process.env.RESEND_API_KEY?.substring(0, 8) + '...');
    
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const data = await resend.emails.send({
      from: 'Blueprint Club <noreply@wnbpc.com>',
      to: email,
      subject: 'Test Email from Blueprint Club',
      html: '<p>This is a test email from Blueprint Club.</p>'
    });

    console.log('Test email sent successfully:', data);
    return res.status(200).json({ message: 'Test email sent', data });
  } catch (error) {
    console.error('Error sending test email:', error);
    return res.status(500).json({ 
      message: 'Error sending test email',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

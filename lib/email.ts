import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  console.log('Starting email verification process...');
  console.log('Email:', email);
  console.log('Using Resend API Key:', process.env.RESEND_API_KEY?.substring(0, 8) + '...');

  const confirmationLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;
  console.log('Generated confirmation link:', confirmationLink);

  try {
    const data = await resend.emails.send({
      from: 'Blueprint Club <noreply@wnbpc.com>',
      to: email,
      subject: 'Verify your email - Blueprint Club',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Verify your email</title>
          </head>
          <body>
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1>Welcome to Blueprint Club!</h1>
              <p>Please verify your email address by clicking the link below:</p>
              <a href="${confirmationLink}" 
                 style="display: inline-block; 
                        padding: 12px 24px; 
                        background-color: #FFC107; 
                        color: white; 
                        text-decoration: none; 
                        border-radius: 4px;">
                Verify Email
              </a>
              <p>Or copy and paste this link in your browser:</p>
              <p>${confirmationLink}</p>
              <p>This link will expire in 24 hours.</p>
            </div>
          </body>
        </html>
      `
    });

    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  console.log('Starting password reset email process...');
  console.log('Email:', email);
  console.log('Using Resend API Key:', process.env.RESEND_API_KEY?.substring(0, 8) + '...');

  const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  console.log('Generated reset link:', resetLink);

  try {
    const data = await resend.emails.send({
      from: 'Blueprint Club <noreply@wnbpc.com>',
      to: email,
      subject: 'Reset your password - Blueprint Club',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Reset your password</title>
          </head>
          <body>
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1>Reset Your Password</h1>
              <p>Click the link below to reset your password:</p>
              <p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
                  Reset Password
                </a>
              </p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
          </body>
        </html>
      `,
    }).catch(err => {
      console.error('Resend API error:', err);
      throw err;
    });

    console.log('Password reset email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send password reset email. Full error:', error);
    throw error;
  }
};

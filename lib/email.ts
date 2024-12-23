import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
  sendVerificationEmail: async (email: string, token: string) => {
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
      return { success: true };
    } catch (err) {
      console.error('Failed to send verification email:', err);
      return { success: false, error: err };
    }
  },

  sendPasswordResetEmail: async (email: string, token: string) => {
    console.log('Starting password reset process...');
    console.log('Email:', email);
    console.log('Using Resend API Key:', process.env.RESEND_API_KEY?.substring(0, 8) + '...');

    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

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
                <a href="${resetLink}" 
                   style="display: inline-block; 
                          padding: 12px 24px; 
                          background-color: #FFC107; 
                          color: white; 
                          text-decoration: none; 
                          border-radius: 4px;">
                  Reset Password
                </a>
                <p>Or copy and paste this link in your browser:</p>
                <p>${resetLink}</p>
                <p>This link will expire in 1 hour.</p>
              </div>
            </body>
          </html>
        `
      });

      console.log('Password reset email sent successfully:', data);
      return { success: true };
    } catch (err) {
      console.error('Failed to send password reset email:', err);
      return { success: false, error: err };
    }
  },

  sendTeamInvitationEmail: async (email: string, teamName: string, inviterName: string) => {
    const joinLink = `${process.env.NEXTAUTH_URL}/auth/join`;

    try {
      const data = await resend.emails.send({
        from: 'Blueprint Club <noreply@wnbpc.com>',
        to: email,
        subject: `You've been invited to join ${teamName}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              <title>Team Invitation</title>
            </head>
            <body>
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1>Team Invitation</h1>
                <p>${inviterName} has invited you to join the team ${teamName}.</p>
                <a href="${joinLink}" 
                   style="display: inline-block; 
                          padding: 12px 24px; 
                          background-color: #FFC107; 
                          color: white; 
                          text-decoration: none; 
                          border-radius: 4px;">
                  Join Team
                </a>
                <p>Or copy and paste this link in your browser:</p>
                <p>${joinLink}</p>
              </div>
            </body>
          </html>
        `
      });

      console.log('Team invitation email sent successfully:', data);
      return { success: true };
    } catch (err) {
      console.error('Failed to send team invitation email:', err);
      return { success: false, error: err };
    }
  },

  sendRoleChangeEmail: async (email: string, teamName: string, newRole: string) => {
    const teamsLink = `${process.env.NEXTAUTH_URL}/teams`;

    try {
      const data = await resend.emails.send({
        from: 'Blueprint Club <noreply@wnbpc.com>',
        to: email,
        subject: `Your role has been updated in ${teamName}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              <title>Role Update</title>
            </head>
            <body>
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1>Role Update</h1>
                <p>Your role in the team ${teamName} has been updated to ${newRole}.</p>
                <a href="${teamsLink}" 
                   style="display: inline-block; 
                          padding: 12px 24px; 
                          background-color: #FFC107; 
                          color: white; 
                          text-decoration: none; 
                          border-radius: 4px;">
                  View Team Settings
                </a>
                <p>Or copy and paste this link in your browser:</p>
                <p>${teamsLink}</p>
              </div>
            </body>
          </html>
        `
      });

      console.log('Role change email sent successfully:', data);
      return { success: true };
    } catch (err) {
      console.error('Failed to send role change email:', err);
      return { success: false, error: err };
    }
  },

  sendMemberRemovalEmail: async (email: string, teamName: string) => {
    try {
      const data = await resend.emails.send({
        from: 'Blueprint Club <noreply@wnbpc.com>',
        to: email,
        subject: `You have been removed from ${teamName}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              <title>Team Removal</title>
            </head>
            <body>
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1>Team Removal</h1>
                <p>You have been removed from the team ${teamName}.</p>
                <p>If you believe this was a mistake, please contact the team administrator.</p>
              </div>
            </body>
          </html>
        `
      });

      console.log('Member removal email sent successfully:', data);
      return { success: true };
    } catch (err) {
      console.error('Failed to send member removal email:', err);
      return { success: false, error: err };
    }
  }
};

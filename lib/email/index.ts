import nodemailer from 'nodemailer';
import { Team, User, TeamMember, Invitation, Role } from '@prisma/client';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Base email template
const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #0066cc;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      This is an automated email. Please do not reply to this message.
    </div>
  </div>
</body>
</html>
`;

// Email templates
const templates = {
  teamInvitation: (invitation: Invitation & { team: Team; inviter: User }) => ({
    subject: `Invitation to join ${invitation.team.name}`,
    html: baseTemplate(`
      <h1>Team Invitation</h1>
      <p>Hello,</p>
      <p>${invitation.inviter.name || invitation.inviter.email} has invited you to join ${invitation.team.name}.</p>
      <a href="${process.env.NEXTAUTH_URL}/auth/join?token=${invitation.token}" class="button">Accept Invitation</a>
    `),
  }),

  roleChange: (
    team: Team,
    member: TeamMember & { user: User },
    oldRole: Role,
    newRole: Role,
    updatedBy: User
  ) => ({
    subject: `Role Updated in ${team.name}`,
    html: baseTemplate(`
      <h1>Role Update</h1>
      <p>Hello ${member.user.name || member.user.email},</p>
      <p>Your role in ${team.name} has been updated from ${oldRole} to ${newRole} by ${updatedBy.name || updatedBy.email}.</p>
    `),
  }),

  memberRemoval: (team: Team, user: User, removedBy: User) => ({
    subject: `Removed from ${team.name}`,
    html: baseTemplate(`
      <h1>Team Membership Removed</h1>
      <p>Hello ${user.name || user.email},</p>
      <p>You have been removed from ${team.name} by ${removedBy.name || removedBy.email}.</p>
    `),
  }),

  verificationEmail: (email: string, token: string) => ({
    subject: 'Verify your email address',
    html: baseTemplate(`
      <h1>Email Verification</h1>
      <p>Hello,</p>
      <p>Please click the button below to verify your email address:</p>
      <a href="${process.env.NEXTAUTH_URL}/auth/verify?token=${token}" class="button">Verify Email</a>
    `),
  }),

  passwordReset: (email: string, token: string) => ({
    subject: 'Reset your password',
    html: baseTemplate(`
      <h1>Password Reset</h1>
      <p>Hello,</p>
      <p>Please click the button below to reset your password:</p>
      <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}" class="button">Reset Password</a>
    `),
  }),
};

// Email sending function
async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export const emailService = {
  async sendTeamInvitation(invitation: Invitation & { team: Team; inviter: User }) {
    return sendEmail(invitation.email, templates.teamInvitation(invitation).subject, templates.teamInvitation(invitation).html);
  },

  async sendRoleChangeNotification(
    team: Team,
    member: TeamMember & { user: User },
    oldRole: Role,
    newRole: Role,
    updatedBy: User
  ) {
    return sendEmail(member.user.email!, templates.roleChange(team, member, oldRole, newRole, updatedBy).subject, templates.roleChange(team, member, oldRole, newRole, updatedBy).html);
  },

  async sendMemberRemovalNotification(team: Team, user: User, removedBy: User) {
    return sendEmail(user.email!, templates.memberRemoval(team, user, removedBy).subject, templates.memberRemoval(team, user, removedBy).html);
  },

  async sendVerificationEmail(email: string, token: string) {
    return sendEmail(email, templates.verificationEmail(email, token).subject, templates.verificationEmail(email, token).html);
  },

  async sendPasswordResetEmail(email: string, token: string) {
    return sendEmail(email, templates.passwordReset(email, token).subject, templates.passwordReset(email, token).html);
  },

  async sendTeamInvitationEmail(email: string, teamName: string, inviterName: string) {
    const subject = `You've been invited to join ${teamName}`;
    const html = `
      <p>Hi there,</p>
      <p>${inviterName} has invited you to join the team ${teamName}.</p>
      <p>Click the link below to accept the invitation:</p>
      <p><a href="${process.env.NEXTAUTH_URL}/auth/join">Join Team</a></p>
    `;
    return sendEmail(email, subject, html);
  },

  async sendRoleChangeEmail(email: string, teamName: string, newRole: string) {
    const subject = `Your role has been updated in ${teamName}`;
    const html = `
      <p>Hi there,</p>
      <p>Your role in the team ${teamName} has been updated to ${newRole}.</p>
      <p>Visit your team settings to view the changes:</p>
      <p><a href="${process.env.NEXTAUTH_URL}/teams">View Team Settings</a></p>
    `;
    return sendEmail(email, subject, html);
  },

  async sendMemberRemovalEmail(email: string, teamName: string) {
    const subject = `You have been removed from ${teamName}`;
    const html = `
      <p>Hi there,</p>
      <p>You have been removed from the team ${teamName}.</p>
      <p>If you believe this was a mistake, please contact the team administrator.</p>
    `;
    return sendEmail(email, subject, html);
  }
};

import nodemailer from 'nodemailer';
import { Team, User, TeamMember, Invitation } from '@prisma/client';

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
      <p>This email was sent from Blueprint Club. If you did not expect this email, please ignore it.</p>
    </div>
  </div>
</body>
</html>
`;

// Email templates
const templates = {
  teamInvitation: (invitation: Invitation & { team: Team; inviter: User }) => ({
    subject: `Invitation to join ${invitation.team.name} on Blueprint Club`,
    html: baseTemplate(`
      <h1>Team Invitation</h1>
      <p>Hello,</p>
      <p>${invitation.inviter.name || invitation.inviter.email} has invited you to join the team "${invitation.team.name}" on Blueprint Club.</p>
      <p>You have been invited as a ${invitation.role.toLowerCase()}.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/teams/join/${invitation.token}" class="button">
        Accept Invitation
      </a>
      <p>This invitation will expire in 7 days.</p>
    `),
  }),

  roleChange: (
    team: Team,
    member: TeamMember & { user: User },
    oldRole: string,
    newRole: string,
    updatedBy: User
  ) => ({
    subject: `Role Update in ${team.name}`,
    html: baseTemplate(`
      <h1>Role Update</h1>
      <p>Hello ${member.user.name || member.user.email},</p>
      <p>Your role in the team "${team.name}" has been updated from ${oldRole.toLowerCase()} to ${newRole.toLowerCase()} by ${
      updatedBy.name || updatedBy.email
    }.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/teams/${team.slug}" class="button">
        View Team
      </a>
    `),
  }),

  ssoConfigUpdate: (team: Team, updatedBy: User) => ({
    subject: `SSO Configuration Updated for ${team.name}`,
    html: baseTemplate(`
      <h1>SSO Configuration Update</h1>
      <p>Hello,</p>
      <p>The SSO configuration for team "${team.name}" has been updated by ${updatedBy.name || updatedBy.email}.</p>
      <p>If you did not make this change, please contact your team administrator immediately.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/teams/${team.slug}/sso" class="button">
        View SSO Settings
      </a>
    `),
  }),

  memberRemoval: (team: Team, member: User, removedBy: User) => ({
    subject: `Removed from ${team.name}`,
    html: baseTemplate(`
      <h1>Team Membership Update</h1>
      <p>Hello ${member.name || member.email},</p>
      <p>You have been removed from the team "${team.name}" by ${removedBy.name || removedBy.email}.</p>
      <p>If you believe this was done in error, please contact your team administrator.</p>
    `),
  }),
};

// Email sending functions
export const sendEmail = async (to: string, template: { subject: string; html: string }) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: template.subject,
      html: template.html,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

export const emailService = {
  /**
   * Send team invitation email
   */
  sendTeamInvitation: async (invitation: Invitation & { team: Team; inviter: User }) => {
    return sendEmail(invitation.email, templates.teamInvitation(invitation));
  },

  /**
   * Send role change notification
   */
  sendRoleChangeNotification: async (
    team: Team,
    member: TeamMember & { user: User },
    oldRole: string,
    newRole: string,
    updatedBy: User
  ) => {
    return sendEmail(
      member.user.email,
      templates.roleChange(team, member, oldRole, newRole, updatedBy)
    );
  },

  /**
   * Send SSO configuration update notification to team owners and admins
   */
  sendSSOConfigUpdateNotification: async (
    team: Team,
    updatedBy: User,
    adminEmails: string[]
  ) => {
    return Promise.all(
      adminEmails.map((email) =>
        sendEmail(email, templates.ssoConfigUpdate(team, updatedBy))
      )
    );
  },

  /**
   * Send member removal notification
   */
  sendMemberRemovalNotification: async (
    team: Team,
    member: User,
    removedBy: User
  ) => {
    return sendEmail(member.email, templates.memberRemoval(team, member, removedBy));
  },
};

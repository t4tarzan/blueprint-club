# BoxyHQ Enterprise Features Documentation

Welcome to the BoxyHQ enterprise features documentation for Blueprint Club. This documentation covers the setup, configuration, and usage of enterprise features including SAML SSO, Directory Sync (SCIM), and Audit Logs.

## Table of Contents

1. [Getting Started](#getting-started)
2. [SAML SSO](#saml-sso)
3. [Directory Sync (SCIM)](#directory-sync-scim)
4. [Audit Logs](#audit-logs)
5. [Team Management](#team-management)
6. [API Reference](#api-reference)
7. [Security Best Practices](#security-best-practices)

## Getting Started

### Prerequisites

- Node.js 18 or later
- PostgreSQL 13 or later
- Environment variables configured (see `.env.example`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/blueprint-club.git
cd blueprint-club
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update your `.env.local` with required values:
```env
# BoxyHQ Configuration
BOXYHQ_SAML_JACKSON_URL=
BOXYHQ_SAML_JACKSON_API_KEY=
BOXYHQ_RETRACED_URL=
BOXYHQ_RETRACED_API_KEY=

# Database
DATABASE_URL=

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

## SAML SSO

SAML SSO allows enterprise users to sign in using their organization's identity provider (IdP).

### Configuration

1. Navigate to Team Settings > SSO Configuration
2. Enable SAML SSO for your team
3. Configure your IdP using the provided metadata
4. Test the SAML configuration

### Supported Identity Providers

- Okta
- Azure AD
- Google Workspace
- OneLogin
- JumpCloud

### Features

- Just-in-Time (JIT) Provisioning
- IdP-Initiated SSO
- SP-Initiated SSO
- Automatic Role Mapping
- Custom Attribute Mapping

For detailed SAML configuration guides, see [SAML Configuration](./saml-configuration.md).

## Directory Sync (SCIM)

SCIM enables automatic user provisioning and deprovisioning between your IdP and Blueprint Club.

### Configuration

1. Navigate to Team Settings > Directory Sync
2. Enable SCIM for your team
3. Copy the SCIM Base URL and Bearer Token
4. Configure SCIM in your IdP

### Features

- Automatic User Provisioning
- Group Synchronization
- Just-in-Time User Creation
- Automatic Deprovisioning
- Role Mapping

For detailed SCIM setup instructions, see [Directory Sync Setup](./directory-sync.md).

## Audit Logs

Audit logs provide a comprehensive record of all activities within your team.

### Features

- Activity Tracking
- Security Event Logging
- User Session Monitoring
- Export Functionality
- Advanced Filtering

### Accessing Audit Logs

1. Navigate to Team Settings > Audit Logs
2. Use filters to find specific events
3. Export logs as needed

For more information about audit logs, see [Audit Logs Guide](./audit-logs.md).

## Team Management

### Features

- Role-Based Access Control
- Member Management
- Invitation System
- Domain-Based Auto-Join
- Team Settings Management

For detailed team management instructions, see [Team Management Guide](./team-management.md).

## API Reference

Our API enables programmatic access to all enterprise features.

### Authentication

All API requests require authentication using an API key or Bearer token.

### Endpoints

- `/api/teams/[id]/saml`
- `/api/teams/[id]/scim`
- `/api/teams/[id]/audit-logs`
- `/api/teams/[id]/members`

For complete API documentation, see [API Reference](./api-reference.md).

## Security Best Practices

### Recommendations

1. Regularly rotate SCIM tokens and API keys
2. Enable MFA for all users
3. Configure IP allowlisting
4. Monitor audit logs regularly
5. Set up security alerts

For detailed security guidelines, see [Security Guide](./security-guide.md).

## Support

For support with enterprise features:

1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Contact support at support@blueprintclub.com
3. Visit our [Help Center](https://help.blueprintclub.com)

## Contributing

Please see our [Contributing Guide](../CONTRIBUTING.md) for guidelines on how to contribute to this project.

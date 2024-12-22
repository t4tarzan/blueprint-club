# Audit Logs Guide

This guide explains how to use and manage audit logs in Blueprint Club.

## Table of Contents

1. [Overview](#overview)
2. [Accessing Audit Logs](#accessing-audit-logs)
3. [Event Types](#event-types)
4. [Filtering and Search](#filtering-and-search)
5. [Export and Reporting](#export-and-reporting)
6. [API Integration](#api-integration)
7. [Best Practices](#best-practices)

## Overview

Audit logs provide a comprehensive record of all activities within your team, helping you monitor security, compliance, and user behavior.

### Features

- Detailed activity tracking
- Security event monitoring
- User session tracking
- IP and device logging
- Export functionality
- Advanced filtering
- Role-based access control

### Data Retention

- Logs retained for 90 days
- Export capability for long-term storage
- Compliance with data protection regulations

## Accessing Audit Logs

### Web Interface

1. Navigate to Team Settings > Audit Logs
2. Use filters to find specific events
3. View detailed information for each event
4. Export logs as needed

### Access Control

- Admin and Owner roles can view all logs
- Configurable access permissions
- IP-based access restrictions available

## Event Types

### Authentication Events

- `user.login`: User login attempts
- `user.logout`: User logout events
- `user.failed_login`: Failed login attempts
- `user.password_reset`: Password reset requests
- `user.mfa_enabled`: MFA enablement
- `user.mfa_disabled`: MFA disablement

### Team Events

- `team.create`: Team creation
- `team.update`: Team settings updates
- `team.delete`: Team deletion
- `member.add`: Member addition
- `member.remove`: Member removal
- `member.update`: Member role updates

### SSO Events

- `sso.configure`: SSO configuration
- `sso.update`: SSO settings updates
- `sso.delete`: SSO removal
- `sso.login`: SSO login attempts

### SCIM Events

- `scim.enable`: SCIM enablement
- `scim.disable`: SCIM disablement
- `scim.token_regenerate`: Token regeneration
- `scim.user_provision`: User provisioning
- `scim.user_deprovision`: User deprovisioning
- `scim.group_sync`: Group synchronization

### API Events

- `api.key_create`: API key creation
- `api.key_delete`: API key deletion
- `api.request`: API requests
- `api.error`: API errors

## Filtering and Search

### Available Filters

1. **Time Range**
   - Custom date range
   - Preset periods (24h, 7d, 30d)
   - Time zone support

2. **Event Category**
   - Authentication
   - Team
   - SSO
   - SCIM
   - API

3. **Event Status**
   - Success
   - Failure

4. **User Filter**
   - By email
   - By name
   - By role

5. **IP Address**
   - Specific IP
   - IP range
   - Geographic location

### Search Syntax

```
category:auth action:user.login status:failure
```

## Export and Reporting

### Export Formats

1. **CSV Export**
   - All fields included
   - UTF-8 encoding
   - RFC 4180 compliant

2. **JSON Export**
   - Structured data
   - Complete event details
   - Metadata included

### Automated Reports

1. **Scheduled Exports**
   - Daily summaries
   - Weekly reports
   - Monthly compliance reports

2. **Custom Reports**
   - Filtered data
   - Selected fields
   - Custom date ranges

## API Integration

### Authentication

```bash
curl -X GET "https://your-domain.com/api/teams/{teamId}/audit-logs" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

### Filtering

```bash
curl -X GET "https://your-domain.com/api/teams/{teamId}/audit-logs?category=auth&status=failure" \
  -H "Authorization: Bearer {token}"
```

### Export

```bash
curl -X GET "https://your-domain.com/api/teams/{teamId}/audit-logs/export" \
  -H "Authorization: Bearer {token}" \
  -o "audit_logs.csv"
```

## Best Practices

### Security

1. **Access Control**
   - Limit audit log access
   - Regular permission reviews
   - IP allowlisting

2. **Data Protection**
   - Sensitive data masking
   - Encryption at rest
   - Secure transmission

3. **Monitoring**
   - Real-time alerts
   - Anomaly detection
   - Threshold monitoring

### Compliance

1. **Data Retention**
   - Policy compliance
   - Regular exports
   - Archival strategy

2. **Documentation**
   - Access records
   - Policy changes
   - Incident reports

3. **Auditing**
   - Regular reviews
   - Compliance checks
   - Third-party audits

### Performance

1. **Query Optimization**
   - Use appropriate filters
   - Limit result sets
   - Index utilization

2. **Export Management**
   - Schedule large exports
   - Compress data
   - Use incremental exports

3. **Resource Usage**
   - Monitor storage
   - Track API usage
   - Optimize queries

## Troubleshooting

### Common Issues

1. **Missing Events**
   - Check permissions
   - Verify filters
   - Review retention policy

2. **Export Problems**
   - File size limits
   - Format issues
   - Network timeouts

3. **Performance Issues**
   - Query optimization
   - Index usage
   - Resource allocation

### Support

For assistance with audit logs:

1. Check the troubleshooting guide
2. Contact support with:
   - Event details
   - Error messages
   - Export logs
3. Review system status

# Directory Sync (SCIM) Guide

This guide covers the setup and usage of Directory Sync using the SCIM 2.0 protocol.

## Table of Contents

1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [Identity Provider Configuration](#identity-provider-configuration)
4. [User Provisioning](#user-provisioning)
5. [Group Synchronization](#group-synchronization)
6. [Troubleshooting](#troubleshooting)

## Overview

Directory Sync enables automatic user provisioning and management between your Identity Provider (IdP) and Blueprint Club.

### Features

- Automatic user provisioning/deprovisioning
- Group synchronization
- Role mapping
- Just-in-Time (JIT) provisioning
- Secure token-based authentication

### Prerequisites

- Enterprise team subscription
- Admin access to your IdP
- Admin access to Blueprint Club
- SCIM 2.0 compatible IdP

## Setup Instructions

### Step 1: Enable Directory Sync

1. Navigate to Team Settings > Directory Sync
2. Click "Enable Directory Sync"
3. Copy the provided:
   - SCIM Base URL: `http://localhost:3000/api/scim/v2.0`
   - Bearer Token

### Step 2: Security Configuration

1. Store the Bearer Token securely
2. Configure IP allowlisting if required
3. Set up monitoring for sync events

### Step 3: Test Configuration

1. Create a test user in your IdP
2. Verify user provisioning in Blueprint Club
3. Update user attributes and verify sync
4. Deactivate test user and verify deprovisioning

## Identity Provider Configuration

### Okta Configuration

1. Log in to Okta Admin Console
2. Navigate to Applications > Create App Integration
3. Select SCIM 2.0
4. Configure SCIM connection:
   - SCIM Base URL: Your SCIM endpoint
   - Authentication: Bearer Token
   - Import Groups: Enabled
5. Configure attribute mapping:
```json
{
  "userName": "email",
  "givenName": "firstName",
  "familyName": "lastName",
  "active": "active",
  "groups": "groups"
}
```

### Azure AD Configuration

1. Access Azure AD Portal
2. Navigate to Enterprise Applications
3. Create New Application
4. Configure Provisioning:
   - Provisioning Mode: Automatic
   - Tenant URL: Your SCIM Base URL
   - Secret Token: Your Bearer Token
5. Configure attribute mapping:
   - userPrincipalName > userName
   - givenName > givenName
   - surname > familyName
   - groups > groups

### OneLogin Configuration

1. Access OneLogin Admin Portal
2. Add New Application > SCIM Provisioner
3. Configure SCIM settings:
   - SCIM Base URL
   - Authentication Token
   - Enable group push
4. Map attributes:
   - Email > userName
   - First Name > givenName
   - Last Name > familyName
   - Groups > groups

## User Provisioning

### Supported Operations

1. **Create User**
   - Automatic user creation
   - Attribute mapping
   - Group assignment

2. **Update User**
   - Profile updates
   - Role changes
   - Status changes

3. **Deactivate User**
   - Account suspension
   - Access revocation
   - Group removal

### Attribute Mapping

Standard SCIM attributes mapped to Blueprint Club:

```json
{
  "userName": "email",
  "name": {
    "givenName": "firstName",
    "familyName": "lastName"
  },
  "emails": [
    {
      "value": "email",
      "primary": true
    }
  ],
  "active": "active",
  "groups": "groups"
}
```

## Group Synchronization

### Group Mapping

1. **Automatic Group Creation**
   - Groups synced from IdP
   - Naming convention preserved
   - Hierarchical structure support

2. **Role Mapping**
   - Map IdP groups to roles
   - Automatic role assignment
   - Custom role mapping

Example configuration:
```json
{
  "groupMapping": {
    "Admins": "ADMIN",
    "Users": "MEMBER",
    "Managers": "MANAGER"
  }
}
```

### Group Management

1. **Group Updates**
   - Membership changes
   - Group attribute updates
   - Hierarchy changes

2. **Group Deletion**
   - Graceful removal
   - Member reassignment
   - Access updates

## Troubleshooting

### Common Issues

1. **Provisioning Failures**
   - Check Bearer Token validity
   - Verify SCIM endpoint accessibility
   - Review attribute mapping

2. **Group Sync Issues**
   - Verify group mapping configuration
   - Check group hierarchy
   - Review group permissions

3. **Update Failures**
   - Check attribute format
   - Verify required fields
   - Review update payload

### Debug Steps

1. **Check Audit Logs**
   - Review sync events
   - Identify error patterns
   - Track user operations

2. **Test Connectivity**
   - Verify SCIM endpoint
   - Check authentication
   - Test network access

3. **Validate Configuration**
   - Review IdP settings
   - Check attribute mapping
   - Verify group configuration

### Support Resources

1. **Documentation**
   - API reference
   - Configuration guides
   - Troubleshooting guides

2. **Support Channels**
   - Technical support
   - Community forums
   - Knowledge base

## Best Practices

1. **Security**
   - Regular token rotation
   - IP allowlisting
   - Audit log monitoring

2. **Performance**
   - Batch operations
   - Rate limiting
   - Caching strategy

3. **Maintenance**
   - Regular testing
   - Configuration backups
   - Update monitoring

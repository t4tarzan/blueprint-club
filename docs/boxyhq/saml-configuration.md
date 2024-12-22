# SAML SSO Configuration Guide

This guide provides detailed instructions for configuring SAML SSO with various identity providers.

## Table of Contents

1. [General Configuration](#general-configuration)
2. [Identity Provider Setup](#identity-provider-setup)
   - [Okta](#okta)
   - [Azure AD](#azure-ad)
   - [Google Workspace](#google-workspace)
   - [OneLogin](#onelogin)
   - [JumpCloud](#jumpcloud)
3. [Advanced Configuration](#advanced-configuration)
4. [Troubleshooting](#troubleshooting)

## General Configuration

### Prerequisites

Before configuring SAML SSO, ensure you have:

1. Admin access to your team in Blueprint Club
2. Admin access to your identity provider
3. A valid domain for your organization

### Basic Setup

1. Navigate to Team Settings > SSO Configuration
2. Click "Enable SAML SSO"
3. Note down the following information:
   - ACS URL: `http://localhost:3000/api/auth/saml/callback`
   - Entity ID: `http://localhost:3000`
   - Metadata URL: `http://localhost:3000/api/auth/saml/metadata`

## Identity Provider Setup

### Okta

1. Log in to your Okta Admin Console
2. Navigate to Applications > Create App Integration
3. Select SAML 2.0
4. Configure the following:
   - Single Sign-On URL: Your ACS URL
   - Audience URI: Your Entity ID
   - Name ID Format: Email Address
   - Application Username: Email
5. Configure attribute statements:
   - email: user.email
   - firstName: user.firstName
   - lastName: user.lastName
6. Copy the IdP metadata URL or download the metadata XML
7. Paste the metadata URL or upload the XML in Blueprint Club

### Azure AD

1. Log in to Azure Portal
2. Navigate to Azure Active Directory > Enterprise Applications
3. Create New Application > Non-gallery application
4. Configure Single Sign-on > SAML
5. Configure Basic SAML Configuration:
   - Identifier: Your Entity ID
   - Reply URL: Your ACS URL
   - Sign on URL: Your application URL
6. Configure User Attributes & Claims:
   - email: user.mail
   - firstName: user.givenname
   - lastName: user.surname
7. Download Federation Metadata XML
8. Upload the XML in Blueprint Club

### Google Workspace

1. Log in to Google Admin Console
2. Navigate to Apps > Web and mobile apps
3. Click Add App > Add custom SAML app
4. Configure SSO settings:
   - ACS URL: Your ACS URL
   - Entity ID: Your Entity ID
   - Name ID Format: EMAIL
5. Configure attribute mapping:
   - Primary email > email
   - First name > firstName
   - Last name > lastName
6. Download the IdP metadata
7. Upload the metadata in Blueprint Club

## Advanced Configuration

### Custom Attribute Mapping

You can map additional attributes from your IdP to Blueprint Club:

```json
{
  "mappings": {
    "email": "user.email",
    "firstName": "user.given_name",
    "lastName": "user.family_name",
    "role": "user.role",
    "department": "user.department"
  }
}
```

### Role Mapping

Map IdP groups or roles to Blueprint Club roles:

```json
{
  "roleMapping": {
    "admin": ["Admin", "Administrator"],
    "member": ["User", "Employee"]
  }
}
```

### Domain Restrictions

Restrict SSO to specific email domains:

```json
{
  "allowedDomains": [
    "company.com",
    "subsidiary.com"
  ]
}
```

## Troubleshooting

### Common Issues

1. **SAML Response Invalid**
   - Check clock synchronization
   - Verify certificate validity
   - Ensure correct encoding of SAML response

2. **User Not Provisioned**
   - Verify JIT provisioning is enabled
   - Check attribute mapping configuration
   - Ensure required attributes are present in SAML response

3. **Access Denied**
   - Verify role mapping configuration
   - Check user permissions in IdP
   - Ensure user email domain is allowed

### Debug Tools

1. **SAML Tracer**
   - Browser extension for SAML debugging
   - View raw SAML requests and responses
   - Verify attribute values

2. **Metadata Validator**
   - Validate IdP metadata format
   - Check certificate expiration
   - Verify endpoint URLs

### Support

If you encounter issues:

1. Check the audit logs for error details
2. Contact support with:
   - SAML trace logs
   - IdP configuration screenshots
   - Error messages
   - Timestamp of the issue

## Security Considerations

1. **Certificate Management**
   - Regularly rotate certificates
   - Monitor certificate expiration
   - Use strong encryption algorithms

2. **Access Control**
   - Implement IP allowlisting
   - Enable MFA when possible
   - Regular access reviews

3. **Monitoring**
   - Monitor failed SSO attempts
   - Set up alerts for suspicious activity
   - Regular configuration audits

# API Reference

This document provides detailed information about the Blueprint Club API endpoints for enterprise features.

## Table of Contents

1. [Authentication](#authentication)
2. [Teams API](#teams-api)
3. [SAML API](#saml-api)
4. [SCIM API](#scim-api)
5. [Audit Logs API](#audit-logs-api)
6. [Error Handling](#error-handling)

## Authentication

All API requests require authentication using a Bearer token.

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Content-Type: application/json" \
     http://localhost:3000/api/teams
```

### API Keys

Generate API keys in Team Settings > API Keys.

Rate limits:
- 1000 requests per minute per IP
- 10000 requests per day per token

## Teams API

### List Teams

```http
GET /api/teams
```

Response:
```json
{
  "teams": [
    {
      "id": "team-1",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "domain": "acme.com",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "pages": 1,
    "page": 1,
    "limit": 50
  }
}
```

### Get Team

```http
GET /api/teams/{teamId}
```

Response:
```json
{
  "id": "team-1",
  "name": "Acme Corp",
  "slug": "acme-corp",
  "domain": "acme.com",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Update Team

```http
PUT /api/teams/{teamId}
```

Request:
```json
{
  "name": "Acme Corporation",
  "domain": "acme.com"
}
```

## SAML API

### Configure SAML

```http
POST /api/teams/{teamId}/saml
```

Request:
```json
{
  "enabled": true,
  "metadata": "<?xml version=\"1.0\"?>...",
  "configuration": {
    "mappings": {
      "email": "user.email",
      "firstName": "user.firstName",
      "lastName": "user.lastName"
    }
  }
}
```

### Get SAML Configuration

```http
GET /api/teams/{teamId}/saml
```

Response:
```json
{
  "enabled": true,
  "entityId": "http://localhost:3000",
  "acsUrl": "http://localhost:3000/api/auth/saml/callback",
  "metadata": "<?xml version=\"1.0\"?>..."
}
```

## SCIM API

### SCIM User Operations

#### List Users

```http
GET /api/scim/v2.0/Users
```

Query Parameters:
- `filter`: SCIM filter expression
- `startIndex`: Pagination start index
- `count`: Items per page

Response:
```json
{
  "schemas": ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
  "totalResults": 1,
  "itemsPerPage": 50,
  "startIndex": 1,
  "Resources": [
    {
      "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
      "id": "user-1",
      "userName": "john@acme.com",
      "name": {
        "givenName": "John",
        "familyName": "Doe"
      },
      "emails": [
        {
          "primary": true,
          "value": "john@acme.com",
          "type": "work"
        }
      ],
      "active": true
    }
  ]
}
```

#### Create User

```http
POST /api/scim/v2.0/Users
```

Request:
```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "userName": "john@acme.com",
  "name": {
    "givenName": "John",
    "familyName": "Doe"
  },
  "emails": [
    {
      "primary": true,
      "value": "john@acme.com",
      "type": "work"
    }
  ],
  "active": true
}
```

### SCIM Group Operations

#### List Groups

```http
GET /api/scim/v2.0/Groups
```

Response:
```json
{
  "schemas": ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
  "totalResults": 1,
  "itemsPerPage": 50,
  "startIndex": 1,
  "Resources": [
    {
      "schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
      "id": "group-1",
      "displayName": "Admins",
      "members": [
        {
          "value": "user-1",
          "display": "John Doe"
        }
      ]
    }
  ]
}
```

## Audit Logs API

### List Audit Logs

```http
GET /api/teams/{teamId}/audit-logs
```

Query Parameters:
- `category`: Event category
- `action`: Event action
- `status`: Event status
- `startDate`: Start date (ISO 8601)
- `endDate`: End date (ISO 8601)
- `page`: Page number
- `limit`: Items per page

Response:
```json
{
  "logs": [
    {
      "id": "log-1",
      "teamId": "team-1",
      "userId": "user-1",
      "action": "user.login",
      "category": "auth",
      "status": "success",
      "ipAddress": "127.0.0.1",
      "userAgent": "Mozilla/5.0",
      "metadata": {},
      "createdAt": "2024-01-01T00:00:00Z",
      "user": {
        "name": "John Doe",
        "email": "john@acme.com"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "pages": 1,
    "page": 1,
    "limit": 50
  }
}
```

### Export Audit Logs

```http
GET /api/teams/{teamId}/audit-logs/export
```

Query Parameters:
- `startDate`: Start date (ISO 8601)
- `endDate`: End date (ISO 8601)
- `format`: Export format (csv/json)

Response: CSV or JSON file download

## Error Handling

### Error Codes

- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

### Error Response Format

```json
{
  "error": {
    "code": "invalid_request",
    "message": "Detailed error message",
    "details": {
      "field": "specific field name",
      "reason": "specific reason"
    }
  }
}
```

### Rate Limiting Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Configure Webhooks

```http
POST /api/teams/{teamId}/webhooks
```

Request:
```json
{
  "url": "https://your-domain.com/webhook",
  "secret": "your-webhook-secret",
  "events": ["user.created", "user.updated"]
}
```

### Webhook Payload

```json
{
  "id": "event-1",
  "type": "user.created",
  "teamId": "team-1",
  "data": {
    "user": {
      "id": "user-1",
      "email": "john@acme.com"
    }
  },
  "createdAt": "2024-01-01T00:00:00Z"
}

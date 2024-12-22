# Blueprint Club Mock Data

This document contains all the mock data needed to demonstrate and test the full functionality of Blueprint Club.

## 1. User Accounts

### Admin Users
```json
{
  "name": "Admin User",
  "email": "admin@blueprintclub.com",
  "password": "Admin@123",
  "role": "ADMIN"
}
```

### Team Owners
```json
{
  "name": "John Smith",
  "email": "john@acme.com",
  "password": "Owner@123",
  "role": "OWNER"
}
```

### Regular Members
```json
[
  {
    "name": "Alice Johnson",
    "email": "alice@company.com",
    "password": "Member@123",
    "role": "MEMBER"
  },
  {
    "name": "Bob Wilson",
    "email": "bob@startup.com",
    "password": "Member@123",
    "role": "MEMBER"
  }
]
```

## 2. Teams

### Enterprise Team
```json
{
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "domain": "acme.com",
  "defaultRole": "MEMBER",
  "features": ["SSO", "SCIM", "Audit Logs"]
}
```

### Startup Team
```json
{
  "name": "Tech Startup",
  "slug": "tech-startup",
  "domain": "startup.com",
  "defaultRole": "MEMBER",
  "features": ["Basic Auth"]
}
```

## 3. SAML SSO Configuration

### Azure AD Configuration
```json
{
  "provider": "Azure AD",
  "encodedRawMetadata": "PHNhbWw...", // Base64 encoded SAML metadata
  "defaultRedirectUrl": "http://localhost:3000/dashboard",
  "redirectUrl": "http://localhost:3000/api/auth/callback/boxyhq-saml",
  "tenant": "acme-corp",
  "product": "blueprint-club"
}
```

### Okta Configuration
```json
{
  "provider": "Okta",
  "encodedRawMetadata": "PHNhbWw...", // Base64 encoded SAML metadata
  "defaultRedirectUrl": "http://localhost:3000/dashboard",
  "redirectUrl": "http://localhost:3000/api/auth/callback/boxyhq-saml",
  "tenant": "tech-startup",
  "product": "blueprint-club"
}
```

## 4. Directory Sync (SCIM)

### SCIM Configuration
```json
{
  "tenant": "acme-corp",
  "product": "blueprint-club",
  "endpoint": "http://localhost:3000/api/scim/v2.0",
  "token": "scim_token_12345",
  "protocol": "SCIM2.0"
}
```

### Sample SCIM Users
```json
[
  {
    "userName": "john.doe@acme.com",
    "givenName": "John",
    "familyName": "Doe",
    "active": true,
    "emails": [
      {
        "primary": true,
        "value": "john.doe@acme.com",
        "type": "work"
      }
    ]
  }
]
```

### Sample SCIM Groups
```json
[
  {
    "displayName": "Engineering",
    "members": [
      {
        "value": "john.doe@acme.com"
      }
    ]
  }
]
```

## 5. API Keys

### Sample API Keys
```json
[
  {
    "name": "Development API Key",
    "key": "bpc_dev_key_12345",
    "teamId": "team_acme_corp",
    "permissions": ["read", "write"]
  },
  {
    "name": "Production API Key",
    "key": "bpc_prod_key_67890",
    "teamId": "team_tech_startup",
    "permissions": ["read"]
  }
]
```

## 6. Audit Log Events

### Sample Audit Events
```json
[
  {
    "type": "auth.login",
    "actor": "john@acme.com",
    "target": "user_profile",
    "action": "login_success",
    "metadata": {
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    }
  },
  {
    "type": "team.member",
    "actor": "admin@blueprintclub.com",
    "target": "team_acme_corp",
    "action": "member_invited",
    "metadata": {
      "invitee": "new.member@acme.com",
      "role": "MEMBER"
    }
  }
]
```

## 7. Test Environment Variables

```env
# Base Configuration
NODE_ENV=development
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="use_a_secure_secret_in_production"

# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/blueprint_club"

# BoxyHQ Enterprise Features
BOXYHQ_SAML_JACKSON_URL="http://localhost:5225"
BOXYHQ_ENTERPRISE_SLUG="blueprint-club"
BOXYHQ_ADMIN_EMAIL="admin@blueprintclub.com"
BOXYHQ_LICENSE_KEY="boxy_key_12345"

# Feature Flags
ENABLE_SSO=true
ENABLE_TEAM_FEATURES=true
ENABLE_AUDIT_LOGS=true
ENABLE_API_KEYS=true
```

## 8. Social Feed Data

### User Profiles
```json
[
  {
    "id": "user_1",
    "name": "Alice Johnson",
    "email": "alice@company.com",
    "avatar": "https://ui-avatars.com/api/?name=Alice+Johnson",
    "bio": "Senior Software Engineer | Open Source Enthusiast | Coffee Lover",
    "location": "San Francisco, CA",
    "joinedDate": "2023-01-15",
    "skills": ["React", "Node.js", "TypeScript", "AWS"],
    "github": "alicejohnson",
    "linkedin": "alice-johnson-dev"
  },
  {
    "id": "user_2",
    "name": "Bob Wilson",
    "email": "bob@startup.com",
    "avatar": "https://ui-avatars.com/api/?name=Bob+Wilson",
    "bio": "Product Manager | UX Design | Startup Mentor",
    "location": "New York, NY",
    "joinedDate": "2023-02-20",
    "skills": ["Product Strategy", "UX/UI", "Agile", "Team Leadership"],
    "github": "bobwilson",
    "linkedin": "bob-wilson-pm"
  },
  {
    "id": "user_3",
    "name": "Sarah Chen",
    "email": "sarah@tech.com",
    "avatar": "https://ui-avatars.com/api/?name=Sarah+Chen",
    "bio": "AI/ML Engineer | Research Paper Author | Tech Speaker",
    "location": "Seattle, WA",
    "joinedDate": "2023-03-10",
    "skills": ["Python", "TensorFlow", "PyTorch", "Computer Vision"],
    "github": "sarahchen",
    "linkedin": "sarah-chen-ai"
  }
]
```

### Posts
```json
[
  {
    "id": "post_1",
    "authorId": "user_1",
    "content": "Just launched our new feature using Next.js 13 and Prisma! The type safety and performance improvements are incredible. Check out the blog post for more details! #webdev #typescript",
    "images": ["https://picsum.photos/800/400"],
    "timestamp": "2023-12-22T10:30:00Z",
    "likes": 42,
    "comments": 8
  },
  {
    "id": "post_2",
    "authorId": "user_2",
    "content": "Excited to announce our latest product milestone! Our team has been working hard on improving user experience. Here's a sneak peek of our new dashboard design.",
    "images": ["https://picsum.photos/800/401"],
    "timestamp": "2023-12-21T15:45:00Z",
    "likes": 35,
    "comments": 5
  },
  {
    "id": "post_3",
    "authorId": "user_3",
    "content": "Just published my research paper on 'Efficient Transformer Models for Edge Computing' at #ICML2023. Thanks to everyone who contributed! Link to paper in comments.",
    "timestamp": "2023-12-20T09:15:00Z",
    "likes": 89,
    "comments": 15
  }
]
```

### Comments
```json
[
  {
    "id": "comment_1",
    "postId": "post_1",
    "authorId": "user_2",
    "content": "Amazing work! The performance improvements are really noticeable.",
    "timestamp": "2023-12-22T11:00:00Z",
    "likes": 5
  },
  {
    "id": "comment_2",
    "postId": "post_1",
    "authorId": "user_3",
    "content": "Would love to know more about your Prisma setup. Can we schedule a chat?",
    "timestamp": "2023-12-22T11:30:00Z",
    "likes": 3
  }
]
```

## 9. Projects

### Active Projects
```json
[
  {
    "id": "proj_1",
    "name": "Website Redesign",
    "description": "Complete overhaul of company website with modern UI/UX",
    "status": "IN_PROGRESS",
    "progress": 75,
    "startDate": "2023-11-01",
    "endDate": "2024-02-28",
    "teamMembers": ["user_1", "user_2"],
    "tags": ["design", "frontend", "ui/ux"]
  },
  {
    "id": "proj_2",
    "name": "AI Chat Integration",
    "description": "Implementing AI-powered chat support system",
    "status": "IN_PROGRESS",
    "progress": 40,
    "startDate": "2023-12-01",
    "endDate": "2024-03-31",
    "teamMembers": ["user_3"],
    "tags": ["ai", "backend", "api"]
  },
  {
    "id": "proj_3",
    "name": "Mobile App Development",
    "description": "Cross-platform mobile app for existing web service",
    "status": "PLANNING",
    "progress": 15,
    "startDate": "2024-01-15",
    "endDate": "2024-06-30",
    "teamMembers": ["user_1", "user_2", "user_3"],
    "tags": ["mobile", "react-native", "cross-platform"]
  }
]
```

## 10. Dashboard Metrics

### Team Statistics
```json
{
  "totalMembers": 12,
  "activeMembers": 10,
  "memberGrowth": {
    "lastMonth": 2,
    "lastQuarter": 5
  },
  "teamActivity": {
    "postsLastWeek": 24,
    "commentsLastWeek": 85,
    "projectUpdates": 15
  }
}
```

### Project Metrics
```json
{
  "totalProjects": 5,
  "activeProjects": 3,
  "completedProjects": 1,
  "plannedProjects": 1,
  "projectHealth": {
    "onTrack": 3,
    "atRisk": 1,
    "delayed": 1
  }
}
```

### Activity Feed
```json
[
  {
    "id": "activity_1",
    "type": "NEW_MEMBER",
    "content": "Sarah Chen joined the team",
    "timestamp": "2023-12-22T08:30:00Z"
  },
  {
    "id": "activity_2",
    "type": "PROJECT_UPDATE",
    "content": "Website Redesign is 75% complete",
    "timestamp": "2023-12-22T10:15:00Z"
  },
  {
    "id": "activity_3",
    "type": "SOCIAL_POST",
    "content": "Alice shared a development update",
    "timestamp": "2023-12-22T11:45:00Z"
  }
]
```

## 11. Testing Instructions

### Initial Setup
1. Start SAML Jackson service
   ```bash
   cd jackson && npm run dev
   ```

2. Start Blueprint Club application
   ```bash
   cd blueprint-club && npm run dev
   ```

### Test Scenarios

1. **Basic Authentication**
   - Sign up as a new user
   - Login with credentials
   - Reset password flow
   - Account lockout after 5 failed attempts

2. **Team Management**
   - Create a new team
   - Invite team members
   - Manage team roles
   - Configure team settings

3. **SSO Configuration**
   - Configure SAML SSO
   - Test IdP-initiated login
   - Test SP-initiated login
   - Test user provisioning

4. **Directory Sync**
   - Configure SCIM
   - Test user provisioning
   - Test user deprovisioning
   - Test group sync

5. **API Key Management**
   - Create API keys
   - Test API endpoints
   - Revoke API keys

6. **Audit Logging**
   - View audit logs
   - Filter events
   - Export audit data

## 12. Common Test Scenarios

### Scenario 1: Enterprise SSO Setup
1. Login as admin@blueprintclub.com
2. Create new team "Acme Corp"
3. Configure SAML SSO using Azure AD settings
4. Test SSO login flow
5. Configure SCIM provisioning
6. Test user sync

### Scenario 2: Team Member Management
1. Login as john@acme.com
2. Create team "Tech Startup"
3. Invite team members
4. Assign roles
5. Test member permissions

### Scenario 3: API Integration
1. Login as admin
2. Generate API keys
3. Test API endpoints
4. Monitor usage in audit logs

## 13. Troubleshooting

### Common Issues
1. SAML Configuration
   - Check metadata format
   - Verify callback URLs
   - Confirm tenant/product mapping

2. SCIM Sync
   - Verify token validity
   - Check endpoint accessibility
   - Confirm user mapping

3. Database
   - Check connection string
   - Verify migrations
   - Confirm schema updates

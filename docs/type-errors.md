# Type Error Tracking

## Dependency-Ordered Type Errors (as of December 23, 2024)

### Level 1: Core Package and Type Definition Issues
These are foundational issues that other errors may depend on:

1. Package Import Issues
   - ✗ `QueryClientProvider` import from '@tanstack/react-query'
   - ✗ Missing `JacksonOption` from '@boxyhq/saml-jackson'
   - ✗ Missing SCIM exports from '@boxyhq/scim-server-node'
   - ✗ Missing default export in date-fns format module

2. Basic Type Definitions
   - ✗ Missing imports in webhook components
   - ✗ Missing 'use-toast' and 'session' module declarations
   - ✗ Missing program property in PrismaClient

### Level 2: Database and Model Issues
These affect how data is stored and retrieved:

1. Prisma Model Issues
   - ✗ Missing `sAMLConnection` property in PrismaClient (5 instances)
   - ✗ Missing subscriptionUsage in PrismaClient
   - ✗ Invalid property 'teamId' in subscription creation

2. Type Definition Issues
   - ✗ SAMLConfig property issues
   - ✗ Missing properties in SubscriptionWithUsage
   - ✗ Invalid property names in invitations endpoints

### Level 3: Authentication and Session Issues
These affect user authentication and session management:

1. Session Types
   - ✗ Session type conversion error in test-utils
   - ✗ Null assignment to string parameter in nextauth
   - ✗ Missing email property in verify endpoint

2. Authentication Flow
   - ✗ SCIM user initialization issues
   - ✗ Missing notification methods in email service

### Level 4: Feature-Specific Issues
These are isolated to specific features:

1. Subscription Features
   - ✗ Missing `SUBSCRIPTION_PLANS` export
   - ✗ Unknown type 'p' in TeamSubscriptionInfo
   - ✗ Missing `SubscriptionPlan` properties
   - ✗ Missing `maxTeamMembers` property

2. Team Management
   - ✗ Missing 'user' property in TeamMembers (3 instances)
   - ✗ Type mismatches in team serialization

3. Webhook Handling
   - ✗ Invalid property 'eventType' in webhook delivery
   - ✗ Missing response and message properties
   - ✗ Invalid argument counts in webhook endpoints
   - ✗ Implicit any types in webhook components

4. Image Processing
   - ✗ Missing 'img' property in plaiceholder
   - ✗ Invalid argument type for plaiceholder

5. Audit Logs
   - ✗ Implicit any types in audit logs export

6. Subscription Service
   - ✗ Invalid property 'teamId' in subscription creation
   - ✗ Missing properties in SubscriptionWithUsage
   - ✗ Missing subscriptionUsage in PrismaClient

7. API Endpoint Issues
   - ✗ Null assignment to string parameter in nextauth
   - ✗ Missing email property in verify endpoint
   - ✗ Implicit any types in audit logs export
   - ✗ Invalid property names in invitations endpoints
   - ✗ Missing notification methods in email service
   - ✗ Invalid argument counts in webhook endpoints

8. Component Issues
   - ✗ Missing 'image' property in ProgramDetailCard
   - ✗ Missing imports in webhook components
   - ✗ Implicit any types in webhook components

### Level 5: UI Component Issues
These are presentation-layer issues:

1. Component Props
   - ✗ Missing 'image' property in ProgramDetailCard

## Fix Priority Order
1. Level 1: Core Package Issues
   - Fix package imports first
   - Add missing type declarations
   - Update PrismaClient definitions

2. Level 2: Database Issues
   - Update Prisma models
   - Fix type definitions for database entities
   - Resolve property naming issues

3. Level 3: Auth Issues
   - Fix session types
   - Resolve authentication flow types
   - Update email service types

4. Level 4: Feature Issues
   - Fix subscription-related types
   - Update team management types
   - Resolve webhook handling
   - Fix image processing types
   - Update audit log types

5. Level 5: UI Issues
   - Fix component prop types

## Progress
- Total Errors: 82
- Fixed: 0
- Remaining: 82

## Next Steps
1. Start with Level 1 issues:
   - Fix React Query provider import
   - Add missing BoxyHQ type declarations
   - Update date-fns import
2. Move to Level 2 database issues
3. Continue through levels 3-5 in order

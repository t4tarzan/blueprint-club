# Blueprint Club Project Memories Guide

## Project Context Overview

### Current Implementation Status
1. **Core Infrastructure (Completed)**
   ```
   - Next.js 13.4.19 with TypeScript
   - NextAuth with custom Prisma adapter
   - Vercel Postgres database
   - Basic deployment at wnbpc.com
   ```

2. **Authentication System (Completed)**
   ```
   - Email/password authentication
   - Custom verification flow
   - JWT session handling
   - User roles and permissions
   ```

3. **Content Structure (Partially Complete)**
   ```
   - Dynamic program pages
   - Responsive navigation
   - Basic animations
   - Initial content framework
   ```

## Key Development Milestones

### Recent Implementations
1. **Authentication System (December 2024)**
   - Custom Prisma adapter implementation
   - Email verification system
   - Type-safe authentication flow
   - Session management

2. **Database Schema**
   - User and Profile models
   - Social interaction models (Posts, Comments, Likes)
   - Program and content models
   - Verification token handling

### Pending Features
1. **Social Platform**
   - User connections system
   - Content sharing
   - Real-time notifications
   - Engagement features

2. **Program Enhancement**
   - 16 Divisions visualization
   - 9 Stages of Learning implementation
   - Success stories integration
   - Interactive learning features

## Reference Points for Cascade

### Authentication Context
When discussing authentication, reference:
```
- Custom PrismaAdapter in lib/auth/prismaAdapter.ts
- NextAuth configuration in pages/api/auth/[...nextauth].ts
- Email verification flow implementation
- JWT session handling
```

### Database Context
When working with the database, remember:
```
- Prisma schema in prisma/schema.prisma
- Custom adapter implementations
- Relation handling between models
- Type-safe database operations
```

### Social Features Context
When implementing social features, consider:
```
- User relationship models (Follow system)
- Content interaction models (Posts, Comments)
- Real-time feature requirements
- Privacy and permission systems
```

## Important Files and Directories

### Core Configuration Files
```
/lib/auth/prismaAdapter.ts - Custom authentication adapter
/prisma/schema.prisma - Database schema
/pages/api/auth/[...nextauth].ts - Auth configuration
/docs/Social.md - Social platform specifications
/docs/approach.md - Implementation phases
/docs/checklist.md - Development checklist
```

### Key Implementation Files
```
/components/* - Reusable UI components
/pages/* - Next.js pages and routing
/lib/* - Core functionality and utilities
/styles/* - Global styles and themes
```

## Development Guidelines

### When Adding New Features
1. **Reference Existing Patterns**
   ```
   - Check similar implementations in codebase
   - Follow established type patterns
   - Maintain consistent error handling
   ```

2. **Authentication Considerations**
   ```
   - Use existing auth hooks and utilities
   - Follow established permission patterns
   - Maintain type safety
   ```

3. **Database Operations**
   ```
   - Use Prisma client for all DB operations
   - Follow existing transaction patterns
   - Maintain referential integrity
   ```

### Common Challenges and Solutions

1. **Type Safety**
   ```typescript
   // Example of proper type handling in auth adapter
   return {
     id: user.id,
     email: user.email,
     name: user.name,
     image: user.image || null,
     emailVerified: user.emailVerified || null,
   } as AdapterUser;
   ```

2. **Authentication Flow**
   ```typescript
   // Reference pattern for protected routes
   export const getServerSideProps = async (context) => {
     const session = await getServerSession(context.req, context.res, authOptions);
     if (!session) {
       return {
         redirect: {
           destination: '/auth/signin',
           permanent: false,
         },
       };
     }
     return { props: { session } };
   };
   ```

3. **Database Relations**
   ```prisma
   // Reference pattern for social relations
   model User {
     id        String    @id @default(cuid())
     followers Follow[]  @relation("following")
     following Follow[]  @relation("follower")
   }
   ```

## Cascade Memories Guide

### Using Cascade Memories

#### How to Reference Previous Work
1. **Session Start References**
   ```
   "Continuing our work on [feature] from last session..."
   "Previously we implemented [feature], now let's add..."
   "We had resolved [issue] by [solution], let's build on that..."
   ```

2. **Context Checkpoints**
   ```
   Key Checkpoints:
   - Initial Auth Implementation (December 2024)
   - Database Schema Setup
   - Notion Integration Planning
   - Social Features Framework
   ```

3. **Project State References**
   ```
   Current State: Version 1 Deployment
   Next Phase: Social Features & Notion Integration
   Future Goal: Complete Learning Platform
   ```

### Project Timeline & Context

#### Version 1 (Current)
1. **Core Infrastructure**
   ```
   Deployment:
   - Live at wnbpc.com
   - Vercel hosting
   - PostgreSQL database
   - NextAuth authentication
   ```

2. **Implemented Features**
   ```
   Authentication:
   - Email/Password system
   - Custom Prisma adapter
   - JWT sessions
   - Email verification

   User Management:
   - Profile system
   - Image handling
   - Password reset
   ```

3. **Current Focus**
   ```
   Social Features:
   - User relationships
   - Content sharing
   - Interaction system
   ```

### Planned Features (Notion Integration)
1. **Content Management**
   ```
   Student Features:
   - Dynamic event showcase
   - Learning materials
   - Resource access
   - Project templates

   Member Features:
   - Progress tracking
   - Project collaboration
   - Team management
   ```

2. **Learning Platform**
   ```
   Core Components:
   - Structured learning paths
   - Workshop materials
   - Video tutorials
   - Portfolio system
   ```

### Key Implementation Details

#### Authentication System
```typescript
// Reference Pattern for Protected Routes
export const getServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }
  return { props: { session } };
};
```

#### Database Schema
```prisma
// Core Models Reference
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  // Relations
  profile       Profile?
  posts         Post[]
  follows       Follow[]
}
```

#### Notion Integration
```typescript
// Integration Pattern
interface NotionContent {
  type: 'event' | 'resource' | 'course';
  metadata: {
    published: boolean;
    access: 'public' | 'member' | 'admin';
  };
  content: {
    title: string;
    description: string;
    materials: string[];
  };
}
```

### Memory Triggers for Development

#### 1. Authentication Context
When discussing auth:
```
Trigger Words:
- "login system"
- "user verification"
- "session handling"
- "protected routes"
```

#### 2. Social Features Context
When working on social:
```
Trigger Words:
- "user connections"
- "content sharing"
- "interactions"
- "real-time features"
```

#### 3. Learning Platform Context
When developing educational features:
```
Trigger Words:
- "course structure"
- "learning paths"
- "progress tracking"
- "resource management"
```

### Troubleshooting References

#### 1. Type Issues
```
Common Patterns:
- NextAuth type compatibility
- Prisma model types
- API response types
```

#### 2. Authentication Flow
```
Key Points:
- Email verification process
- Session management
- Protected routes
- Role-based access
```

#### 3. Database Operations
```
Important Aspects:
- Transaction handling
- Relation management
- Migration processes
- Data validation
```

### Future Development Context

#### 1. Short-term Goals
```
Priority Features:
- Complete social platform
- Notion content integration
- Learning path implementation
```

#### 2. Long-term Vision
```
Platform Evolution:
- Full learning management system
- Advanced analytics
- Mobile application
- AI-powered features
```

### Using This Guide

#### For Development Sessions
1. Start with context reference:
   ```
   "Based on our last session working on [feature]..."
   "Continuing from checkpoint [name]..."
   ```

2. Reference implementation patterns:
   ```
   "We previously solved [issue] using [pattern]..."
   "Following our established pattern for [feature]..."
   ```

3. Track progress:
   ```
   "We've completed [feature] and now moving to [next]..."
   "This builds on our previous work with [component]..."
   ```

#### For Troubleshooting
1. Reference similar issues:
   ```
   "We encountered this in [previous feature]..."
   "Similar to [past issue], we can..."
   ```

2. Solution patterns:
   ```
   "We resolved this type of issue by..."
   "Following our established pattern for..."
   ```

## Future Development Path

### Immediate Next Steps
1. Social Platform Implementation
   - User connections system
   - Content sharing features
   - Real-time notifications

2. Program Enhancement
   - Interactive learning features
   - Success stories integration
   - Enrollment process

3. Technical Improvements
   - Performance optimization
   - SEO implementation
   - Analytics integration

### Long-term Goals
1. Complete Social Integration
2. Enhanced Learning Features
3. Analytics and Reporting
4. Mobile App Development

## Notes for Cascade
- Always reference this document for project context
- Check implementation patterns in existing code
- Follow established type safety patterns
- Maintain consistent error handling
- Consider scalability in new features

Last Updated: December 2024

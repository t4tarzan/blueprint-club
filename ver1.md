# Blueprint Club Website - Version 1 Documentation

## Project Overview
Blueprint Club Website is a Next.js-based web application with TypeScript, featuring authentication, user profiles, posts, and social features. The application is deployed on Vercel and uses PostgreSQL for data storage.

## Tech Stack
- **Frontend Framework**: Next.js 13.4.19
- **Language**: TypeScript
- **Styling**: Tailwind CSS with PostCSS
- **Authentication**: NextAuth.js 4.24.5
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel
- **Content Management**: Notion API Integration
- **UI Components**: 
  - HeroIcons for icons
  - Framer Motion for animations

## Key Features
1. **Authentication System**
   - Email/Password authentication
   - Email verification flow
   - Session management with JWT
   - Custom Prisma adapter for NextAuth
   - Password hashing with bcryptjs

2. **User Management**
   - User profiles with customizable fields
   - Profile image support
   - Email verification system
   - Password reset functionality

3. **Social Features**
   - Posts and comments
   - Like system
   - Follow/Unfollow functionality
   - User relationships

4. **Content Management**
   - Integration with Notion API
   - Markdown support for content
   - Rich text editing capabilities

## Database Schema
The database is structured with the following main models:

1. **User Model**
   ```prisma
   model User {
     id            String    @id @default(cuid())
     name          String?
     email         String    @unique
     password      String?
     emailVerified DateTime?
     image         String?
     createdAt     DateTime  @default(now())
     updatedAt     DateTime  @updatedAt
     // Relations
     accounts      Account[]
     sessions      Session[]
     profile       Profile?
     posts         Post[]
     comments      Comment[]
     likes         Like[]
     followers     Follow[]
     following     Follow[]
   }
   ```

2. **Profile Model**
   ```prisma
   model Profile {
     id          String   @id @default(cuid())
     bio         String?  @db.Text
     location    String?
     website     String?
     occupation  String?
     interests   String[]
     userId      String   @unique
     user        User     @relation(fields: [userId], references: [id])
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }
   ```

3. **Post Model**
   ```prisma
   model Post {
     id        String    @id @default(cuid())
     title     String
     content   String    @db.Text
     published Boolean   @default(false)
     authorId  String
     author    User      @relation(fields: [authorId], references: [id])
     comments  Comment[]
     likes     Like[]
     createdAt DateTime  @default(now())
     updatedAt DateTime  @updatedAt
   }
   ```

## Authentication Implementation
The authentication system uses NextAuth.js with a custom Prisma adapter:

1. **Custom Prisma Adapter**
   - Located in `lib/auth/prismaAdapter.ts`
   - Handles all authentication-related database operations
   - Custom implementation for email verification
   - Type-safe implementation with proper error handling

2. **NextAuth Configuration**
   - Located in `pages/api/auth/[...nextauth].ts`
   - JWT-based session handling
   - Custom pages for sign-in, sign-up, and error handling
   - Secure password handling with bcryptjs

## Environment Variables
Required environment variables:
```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
NOTION_API_KEY=your-notion-api-key
```

## Deployment Configuration
1. **Vercel Configuration**
   - Automatic deployments from main branch
   - Environment variables set in Vercel dashboard
   - PostgreSQL database integration
   - Custom domain setup

2. **Build Settings**
   - Node.js version: 16.x or higher
   - Build command: `next build`
   - Output directory: `.next`
   - Install command: `npm install`

## Common Issues and Solutions

### 1. Type Compatibility Issues
- **Problem**: Type mismatches between NextAuth and Prisma adapter
- **Solution**: Implement proper type casting and ensure correct field mappings in the custom adapter

### 2. Authentication Flow
- **Problem**: Email verification token handling
- **Solution**: Custom implementation of verification token system with proper database schema

### 3. Database Relations
- **Problem**: Cascade deletions and referential integrity
- **Solution**: Proper implementation of onDelete cascades in Prisma schema

## Future Improvements
1. **Performance Optimization**
   - Implement image optimization
   - Add caching layer
   - Optimize database queries

2. **Feature Additions**
   - Add OAuth providers
   - Implement real-time notifications
   - Add file upload capabilities

3. **Security Enhancements**
   - Add rate limiting
   - Implement CSRF protection
   - Add 2FA support

## Maintenance Guidelines
1. **Database Migrations**
   - Always backup before migrations
   - Test migrations in development
   - Use Prisma migrate with caution

2. **Deployment Process**
   - Test in development environment
   - Check environment variables
   - Verify database connections
   - Monitor deployment logs

3. **Code Quality**
   - Maintain TypeScript strict mode
   - Follow ESLint rules
   - Keep dependencies updated
   - Document API changes

## Troubleshooting Guide
1. **Authentication Issues**
   - Check environment variables
   - Verify database connections
   - Check NextAuth logs
   - Verify email service configuration

2. **Database Issues**
   - Check connection string
   - Verify Prisma schema
   - Check for migration issues
   - Monitor database logs

3. **Deployment Issues**
   - Check Vercel build logs
   - Verify environment variables
   - Check for type errors
   - Monitor runtime errors

## Contact and Support
For issues and support:
1. Check the documentation first
2. Review GitHub issues
3. Contact the development team
4. Check Vercel status page

---

This documentation is a living document and should be updated as the project evolves. Last updated: December 2024.

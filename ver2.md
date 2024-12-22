# Blueprint Club Website - Version 2 Documentation

## Project Overview
Blueprint Club Website is a Next.js-based web application with TypeScript, featuring enterprise-grade authentication with BoxyHQ SAML SSO, comprehensive program management, and an advanced dashboard system. The application is deployed on Vercel and uses PostgreSQL for data storage.

## Tech Stack Updates
- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with PostCSS
- **Authentication**: 
  - NextAuth.js with BoxyHQ SAML SSO
  - SCIM for directory sync
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel
- **UI Components**: 
  - HeroIcons for icons
  - Framer Motion for animations
  - Shadcn/ui components

## New Features & Improvements

1. **Enterprise Authentication**
   - BoxyHQ SAML SSO integration
   - SCIM directory synchronization
   - Team management system
   - Role-based access control
   - Audit logging
   - API key management

2. **Program Management**
   - Four distinct programs:
     - BPC Adults (Professional Development)
     - BPC Schooling (K-12 Education)
     - BPC After School (Supplementary Education)
     - BPC Academy (Technical Training)
   - Program-specific content and resources
   - Progress tracking
   - Certification management

3. **Dashboard System**
   - User-specific dashboard
   - Program progress tracking
   - Upcoming classes overview
   - Activity monitoring
   - Team collaboration features

4. **UI/UX Improvements**
   - Responsive navigation system:
     - Public navigation (Home, Programs, About, Contact)
     - Dashboard navigation (Dashboard, Social, Profile)
   - Context-aware layouts
   - Improved accessibility
   - Modern design patterns

5. **Content Organization**
   - Program-specific pages with detailed information
   - Resource libraries
   - Progress tracking
   - Interactive learning materials

## Architecture Changes

1. **Layout System**
   ```typescript
   // Layout component with context-aware navigation
   const Layout = ({ children }: LayoutProps) => {
     const router = useRouter();
     const isDashboardPage = router.pathname.startsWith('/dashboard');
     const isSocialPage = router.pathname.startsWith('/social');
     const showNavbar = !isDashboardPage && !isSocialPage;

     return (
       <div className="min-h-screen flex flex-col">
         {showNavbar && <Navbar />}
         <main className="flex-grow">{children}</main>
         {showNavbar && <Footer />}
       </div>
     );
   };
   ```

2. **Program Structure**
   ```typescript
   interface Program {
     variant: 'adults' | 'schooling' | 'afterschool' | 'academy';
     title: string;
     subtitle: string;
     description: string;
     features: Feature[];
     phases?: Phase[];
     benefits: string[];
     schedule?: Schedule;
     certifications?: string[];
   }
   ```

3. **Dashboard Components**
   ```typescript
   interface DashboardLayoutProps {
     children: ReactNode;
     currentPath: string;
   }

   const DashboardLayout = ({ children, currentPath }: DashboardLayoutProps) => {
     // Dashboard-specific navigation and layout
   };
   ```

## Security Enhancements
1. **Authentication**
   - SAML SSO support
   - Multi-factor authentication
   - Enhanced session management
   - Secure password policies

2. **Authorization**
   - Role-based access control
   - Team-based permissions
   - Resource-level security
   - API key authentication

3. **Data Protection**
   - Encrypted data storage
   - Secure API endpoints
   - Rate limiting
   - Audit logging

## Deployment Changes
1. **Environment Configuration**
   - BoxyHQ service configuration
   - SAML endpoints setup
   - Database migration updates
   - New environment variables

2. **Performance Optimization**
   - Static page generation
   - Image optimization
   - Code splitting
   - Caching strategies

## Future Roadmap
1. **Phase 1: Enhanced Learning Features**
   - Interactive course materials
   - Real-time collaboration tools
   - Progress tracking dashboards
   - Assessment system

2. **Phase 2: Community Features**
   - Discussion forums
   - Peer review system
   - Mentorship platform
   - Resource sharing

3. **Phase 3: Analytics & Reporting**
   - Learning analytics
   - Progress reports
   - Performance metrics
   - Engagement tracking

## Migration Guide
1. **Database Updates**
   - New tables for programs and courses
   - Team management schema
   - Audit log structure
   - SCIM data models

2. **Authentication Changes**
   - BoxyHQ SAML configuration
   - Directory sync setup
   - User migration process
   - Session management updates

3. **Frontend Updates**
   - New component structure
   - Updated routing system
   - Enhanced state management
   - Improved error handling

## Maintenance Notes
1. **Regular Tasks**
   - Database backups
   - Log rotation
   - Security updates
   - Performance monitoring

2. **Emergency Procedures**
   - Rollback procedures
   - Incident response
   - Data recovery
   - Service restoration

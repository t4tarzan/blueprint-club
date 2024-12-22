import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of public paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/auth/verify',
  '/api/auth/session',
  '/api/auth/session-debug',
  '/api/auth/callback',
  '/api/auth/signin',
  '/api/auth/signout',
  '/bpc-adults',
  '/bpc-schooling',
  '/bpcas',
  '/white-noise-academy',
  '/about',
  '/contact',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for public paths and their subpaths
  if (publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  // Skip auth check for static files and images
  if (
    pathname.startsWith('/_next') || // Next.js static files
    pathname.startsWith('/static') || // Static assets
    pathname.startsWith('/images') || // Image assets
    pathname.includes('.') // Files with extensions
  ) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    // If user is not logged in and trying to access a protected route,
    // redirect to login page
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Get user's membership tier from token
    const membershipTier = token.membershipTier as string || 'FREE';

    // Define protected routes and their required tiers
    const protectedRoutes = {
      '/dashboard': ['FREE', 'PREMIUM', 'ENTERPRISE'],
      '/social': ['FREE', 'PREMIUM', 'ENTERPRISE'],
      '/settings': ['FREE', 'PREMIUM', 'ENTERPRISE'],
    };

    // Check if the current route is protected and user has required tier
    for (const [route, allowedTiers] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route) && !allowedTiers.includes(membershipTier)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};

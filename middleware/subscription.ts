import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

const PUBLIC_PATHS = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/stripe/webhook',
];

export async function middleware(request: NextRequest) {
  // Allow public paths
  if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Check authentication
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Get user's subscription
  const user = await prisma.user.findUnique({
    where: { id: token.sub as string },
    include: {
      subscription: true,
    },
  });

  if (!user) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  const activeSubscription = user.subscription;

  // If no active subscription, redirect to billing
  if (!activeSubscription && !request.nextUrl.pathname.startsWith('/settings/billing')) {
    return NextResponse.redirect(new URL('/settings/billing', request.url));
  }

  // Check team member limits based on subscription
  if (request.nextUrl.pathname.startsWith('/api/teams')) {
    const teamMembersCount = await prisma.teamMember.count({
      where: {
        team: {
          createdById: user.id,
        },
      },
    });

    const maxTeamMembers = getMaxTeamMembers(activeSubscription?.priceId);
    if (teamMembersCount >= maxTeamMembers) {
      return new NextResponse(
        JSON.stringify({
          error: 'Team member limit reached. Please upgrade your subscription.',
        }),
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

function getMaxTeamMembers(priceId?: string): number {
  switch (priceId) {
    case process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID:
      return 5;
    case process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID:
      return 20;
    case process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID:
      return Infinity;
    default:
      return 0;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

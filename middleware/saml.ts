import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/env.mjs';

interface SAMLClientInstance {
  getMetadata: (tenant: string, product: string) => Promise<string>;
  getAuthorizationUrl: (options: { tenant: string; product: string; redirectUrl: string; state?: string }) => Promise<string>;
}

export async function samlMiddleware(request: NextRequest) {
  // Only handle SAML-related paths
  if (!request.nextUrl.pathname.startsWith('/api/auth/saml')) {
    return NextResponse.next();
  }

  try {
    const tenant = request.nextUrl.searchParams.get('tenant') ?? 'default';
    const product = request.nextUrl.searchParams.get('product') ?? 'default';

    // Redirect to BoxyHQ OAuth endpoint
    const oauthUrl = new URL('/api/oauth/authorize', env.BOXYHQ_SAML_ISSUER);
    oauthUrl.searchParams.set('client_id', env.BOXYHQ_SAML_CLIENT_ID);
    oauthUrl.searchParams.set('redirect_uri', `${env.NEXTAUTH_URL}/api/auth/callback/boxyhq-saml`);
    oauthUrl.searchParams.set('response_type', 'code');
    oauthUrl.searchParams.set('scope', 'openid email profile');
    oauthUrl.searchParams.set('tenant', tenant);
    oauthUrl.searchParams.set('product', product);

    return NextResponse.redirect(oauthUrl);
  } catch (error) {
    console.error('SAML error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: '/api/auth/saml/:path*',
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SAMLService } from '../lib/boxyhq/saml-service';

export async function samlMiddleware(request: NextRequest) {
  const samlService = SAMLService.getInstance();

  // Only handle SAML-related paths
  if (!request.nextUrl.pathname.startsWith('/api/auth/saml')) {
    return NextResponse.next();
  }

  try {
    // Handle SAML metadata requests
    if (request.nextUrl.pathname === '/api/auth/saml/metadata') {
      const tenant = request.nextUrl.searchParams.get('tenant');
      const product = request.nextUrl.searchParams.get('product');

      if (!tenant || !product) {
        return new NextResponse('Missing tenant or product', { status: 400 });
      }

      const metadata = await samlService.getMetadata(tenant, product);
      return new NextResponse(metadata, {
        headers: {
          'Content-Type': 'text/xml',
        },
      });
    }

    // Handle SAML authorization requests
    if (request.nextUrl.pathname === '/api/auth/saml/authorize') {
      const tenant = request.nextUrl.searchParams.get('tenant');
      const product = request.nextUrl.searchParams.get('product');
      const redirectUri = request.nextUrl.searchParams.get('redirect_uri');
      const state = request.nextUrl.searchParams.get('state');

      if (!tenant || !product || !redirectUri) {
        return new NextResponse('Missing required parameters', { status: 400 });
      }

      const authUrl = await samlService.getAuthorizationUrl({
        tenant,
        product,
        redirectUri,
        state: state || undefined,
      });

      return NextResponse.redirect(authUrl);
    }

    // Continue to API route for other SAML endpoints
    return NextResponse.next();
  } catch (error) {
    console.error('SAML Middleware Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const config = {
  matcher: '/api/auth/saml/:path*',
};

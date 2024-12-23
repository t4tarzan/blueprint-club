interface Env {
  redirectIfAuthenticated: string;
  redirectIfUnauthenticated: string;
  appName: string;
  appDescription: string;
  appUrl: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  boxyhqSamlJacksonUrl: string;
  boxyhqEnterpriseSlug: string;
  nextAuthUrl: string;
  databaseUrl: string;
  boxyhqClientSecretVerifier: string;
  boxyhqAdminEmail: string;
  boxyhqLicenseKey: string;
}

const env: Env = {
  redirectIfAuthenticated: process.env.NEXT_PUBLIC_REDIRECT_IF_AUTHENTICATED || '/teams',
  redirectIfUnauthenticated: process.env.NEXT_PUBLIC_REDIRECT_IF_UNAUTHENTICATED || '/auth/login',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Blueprint Club',
  appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'The Blueprint Club',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  boxyhqSamlJacksonUrl: process.env.BOXYHQ_SAML_JACKSON_URL || '',
  boxyhqEnterpriseSlug: process.env.BOXYHQ_ENTERPRISE_SLUG || '',
  nextAuthUrl: process.env.NEXTAUTH_URL || '',
  databaseUrl: process.env.DATABASE_URL || '',
  boxyhqClientSecretVerifier: process.env.BOXYHQ_CLIENT_SECRET_VERIFIER || '',
  boxyhqAdminEmail: process.env.BOXYHQ_ADMIN_EMAIL || '',
  boxyhqLicenseKey: process.env.BOXYHQ_LICENSE_KEY || '',
};

export default env;

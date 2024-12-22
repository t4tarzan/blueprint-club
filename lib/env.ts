const env = {
  redirectIfAuthenticated: '/dashboard',
  redirectIfUnauthenticated: '/auth/login',
  appName: 'Blueprint Club',
  appDescription: 'Blueprint Club - Enterprise Ready Platform',
  appUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};

export default env;

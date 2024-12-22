import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

// Mock session data
export const mockSession: Session = {
  user: {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    image: null,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

// Custom render function that includes providers
function render(
  ui: React.ReactElement,
  {
    session = mockSession,
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock team data
export const mockTeam = {
  id: 'team-1',
  name: 'Test Team',
  slug: 'test-team',
  domain: 'test.com',
  scimEnabled: false,
  scimToken: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock audit log data
export const mockAuditLog = {
  id: 'log-1',
  teamId: 'team-1',
  userId: 'user-1',
  action: 'user.login',
  category: 'auth',
  status: 'success',
  ipAddress: '127.0.0.1',
  userAgent: 'Mozilla/5.0',
  metadata: {},
  createdAt: new Date().toISOString(),
  user: {
    name: 'Test User',
    email: 'test@example.com',
  },
};

// Mock API response
export const mockApiResponse = (status: number, data: any) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
};

// Re-export everything
export * from '@testing-library/react';
export { render };

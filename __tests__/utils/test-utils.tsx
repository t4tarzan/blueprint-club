import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { Team, User, TeamMember, Role } from '@prisma/client';

type SerializedUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: Date | null;
  membershipTier: string;
  teams: {
    id: string;
    name: string;
    slug: string;
    role: Role;
  }[];
};

jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  getSession: jest.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

interface WrapperProps {
  children: React.ReactNode;
  session?: Session | null;
}

function Wrapper({ children, session = null }: WrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export function render(ui: React.ReactElement, { session = null, ...renderOptions } = {}) {
  return rtlRender(ui, { wrapper: (props) => <Wrapper {...props} session={session} />, ...renderOptions });
}

const now = new Date().toISOString();

export const mockUser: SerializedUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  image: null,
  emailVerified: null,
  membershipTier: 'free',
  teams: [
    {
      id: '1',
      name: 'Test Team',
      slug: 'test-team',
      role: 'ADMIN',
    },
  ],
};

export const mockTeam: Team & { members: TeamMember[] } = {
  id: 'team-1',
  name: 'Test Team',
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  slug: 'test-team',
  description: null,
  domain: null,
  features: [],
  createdById: mockUser.id,
  members: [{
    id: 'member-1',
    teamId: 'team-1',
    userId: mockUser.id,
    role: 'ADMIN',
    createdAt: new Date(),
    updatedAt: new Date(),
  }],
};

export const mockAuditLog = {
  id: 'audit-1',
  teamId: mockTeam.id,
  userId: mockUser.id,
  action: 'TEAM_MEMBER_ADDED',
  category: 'TEAM',
  status: 'SUCCESS',
  metadata: { role: 'ADMIN' },
  createdAt: new Date(),
  updatedAt: new Date(),
  team: mockTeam,
  user: mockUser,
};

export const mockSession: Session = {
  user: mockUser,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export function renderWithProviders(ui: React.ReactElement) {
  return render(ui, {});
}

export * from '@testing-library/react';

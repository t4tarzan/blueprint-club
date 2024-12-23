import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query/build/legacy/QueryClientProvider';
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

type WrapperProps = {
  children: React.ReactNode;
  session?: Session | null;
};

export function Wrapper({ children, session = null }: WrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function renderWithProviders(ui: React.ReactNode, { session, ...renderOptions }: { session?: Session | null } = {}) {
  return render(ui, { wrapper: (props) => <Wrapper {...props} session={session} />, ...renderOptions });
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

export { screen, fireEvent, waitFor };

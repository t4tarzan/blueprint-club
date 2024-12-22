import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Team, TeamMember } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { TeamCard } from '../../components/teams/TeamCard';
import { CreateTeamForm } from '../../components/teams/CreateTeamForm';

interface TeamsPageProps {
  teams: (Team & {
    members: TeamMember[];
  })[];
  currentTeam?: Team;
}

export default function TeamsPage({ teams, currentTeam }: TeamsPageProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSwitchTeam = async (teamId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/teams/${teamId}/switch`, {
        method: 'POST',
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to switch team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Create Team
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Create New Team
              </h3>
              <div className="mt-5">
                <CreateTeamForm
                  onSuccess={() => {
                    setShowCreateForm(false);
                    window.location.reload();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            isCurrentTeam={currentTeam?.id === team.id}
            onSwitchTeam={handleSwitchTeam}
          />
        ))}
      </div>

      {teams.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No teams yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new team.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Team
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">
            <p className="text-gray-900">Switching team...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  // Get current team from session or domain
  let currentTeam = null;
  if (context.req.headers.host) {
    currentTeam = await prisma.team.findFirst({
      where: {
        domain: context.req.headers.host,
      },
    });
  }

  if (!currentTeam && teams.length > 0) {
    currentTeam = teams[0];
  }

  return {
    props: {
      teams: JSON.parse(JSON.stringify(teams)),
      currentTeam: currentTeam ? JSON.parse(JSON.stringify(currentTeam)) : null,
    },
  };
};

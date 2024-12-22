import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Team, TeamMember, User, Invitation } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { TeamMembers } from '../../../components/teams/TeamMembers';

interface TeamMembersPageProps {
  team: Team & {
    members: (TeamMember & {
      user: User;
    })[];
    invitations: (Invitation & {
      inviter: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
      };
    })[];
  };
}

export default function TeamMembersPage({ team }: TeamMembersPageProps) {
  const [activeTab, setActiveTab] = useState('members');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your team members and invitations.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-4 sm:px-6">
            <button
              onClick={() => setActiveTab('members')}
              className={`${
                activeTab === 'members'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Members ({team.members.length})
            </button>
            <button
              onClick={() => setActiveTab('invitations')}
              className={`${
                activeTab === 'invitations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Invitations ({team.invitations.filter(i => i.status === 'PENDING').length})
            </button>
          </nav>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'members' ? (
            <TeamMembers
              team={team}
              onMemberUpdate={() => {
                window.location.reload();
              }}
            />
          ) : (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invited By
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {team.invitations
                      .filter(invitation => invitation.status === 'PENDING')
                      .map(invitation => (
                        <tr key={invitation.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invitation.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invitation.role.toLowerCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invitation.inviter.name || invitation.inviter.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={async () => {
                                if (confirm('Are you sure you want to cancel this invitation?')) {
                                  await fetch(
                                    `/api/teams/${team.id}/invitations/${invitation.token}`,
                                    {
                                      method: 'DELETE',
                                    }
                                  );
                                  window.location.reload();
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {team.invitations.filter(i => i.status === 'PENDING').length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500">No pending invitations</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const slug = context.params?.slug as string;

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const team = await prisma.team.findUnique({
    where: { slug },
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
      invitations: {
        include: {
          inviter: {
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

  if (!team) {
    return {
      notFound: true,
    };
  }

  // Check if user is a member of the team
  const isMember = team.members.some(member => member.userId === session.user.id);

  if (!isMember) {
    return {
      redirect: {
        destination: '/teams',
        permanent: false,
      },
    };
  }

  return {
    props: {
      team: JSON.parse(JSON.stringify(team)),
    },
  };
};

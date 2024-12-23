import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Team, User, TeamMember } from '../../../types';
import { prisma } from '../../../lib/prisma';
import { TeamSettings } from '../../../components/teams/TeamSettings';

interface TeamSettingsPageProps {
  team: Team & {
    members: (TeamMember & {
      user: User;
    })[];
  };
}

export default function TeamSettingsPage({ team }: TeamSettingsPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Team Settings</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your team settings and members.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <TeamSettings
            team={team}
            onUpdate={() => {
              window.location.reload();
            }}
          />
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

import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Team, TeamMember, User } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { SAMLConfig } from '../../../components/teams/SAMLConfig';
import { hasTeamRole } from '../../../lib/boxyhq/utils';

interface TeamSSOPageProps {
  team: Team & {
    members: (TeamMember & {
      user: User;
    })[];
  };
}

export default function TeamSSOPage({ team }: TeamSSOPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Single Sign-On</h1>
        <p className="mt-2 text-sm text-gray-500">
          Configure SAML-based Single Sign-On (SSO) for your team.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <SAMLConfig
            team={team}
            onUpdate={() => {
              window.location.reload();
            }}
          />
        </div>
      </div>

      <div className="mt-8 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">SSO Best Practices</h3>
          <div className="mt-4 text-sm text-gray-500 space-y-4">
            <p>
              <strong>1. Identity Provider (IdP) Setup:</strong>
              <br />
              - Configure your IdP with the SP metadata provided above
              <br />
              - Ensure the correct attributes are mapped (email is required)
              <br />
              - Test the configuration before enabling enforcement
            </p>
            <p>
              <strong>2. Security Recommendations:</strong>
              <br />
              - Use strong certificates for signing SAML requests
              <br />
              - Enable encryption when possible
              <br />
              - Regularly rotate certificates and secrets
            </p>
            <p>
              <strong>3. User Management:</strong>
              <br />
              - Keep IdP user data in sync with your application
              <br />
              - Set up proper user deprovisioning procedures
              <br />
              - Consider implementing Just-in-Time (JIT) provisioning
            </p>
            <p>
              <strong>4. Testing and Maintenance:</strong>
              <br />
              - Regularly test SSO configuration
              <br />
              - Monitor SSO login attempts and failures
              <br />
              - Keep IdP metadata and certificates up to date
            </p>
          </div>
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

  // Check if user is a member and has permission to manage SSO
  const hasPermission = await hasTeamRole({
    userId: session.user.id,
    teamId: team.id,
    roles: ['OWNER', 'ADMIN'],
  });

  if (!hasPermission) {
    return {
      redirect: {
        destination: `/teams/${slug}`,
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

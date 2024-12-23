import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { TeamService } from '@/lib/team-service';
import { SerializedTeam, SerializedTeamMember } from '@/lib/types/prisma';
import TeamMembers from '@/components/teams/TeamMembers';
import { hasTeamRole } from '@/lib/boxyhq/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Role } from '@prisma/client';

interface TeamPageProps {
  team: SerializedTeam;
}

export default function TeamPage({ team }: TeamPageProps) {
  const router = useRouter();
  const { tab = 'members' } = router.query;
  
  const [currentTeam, setCurrentTeam] = useState<SerializedTeam>(team);

  const handleTabChange = (value: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, tab: value },
    }, undefined, { shallow: true });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{currentTeam.name}</h1>
      
      <Tabs value={tab as string} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="sso">SSO</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
          <TeamMembers team={currentTeam} />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Team Settings</h2>
            {/* Add team settings component here */}
          </div>
        </TabsContent>
        
        <TabsContent value="sso">
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">SSO Configuration</h2>
            {/* Add SSO configuration component here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<TeamPageProps> = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  const slug = context.params?.slug as string;
  const teamService = new TeamService();
  const team = await teamService.findBySlug(slug);

  if (!team) {
    return {
      notFound: true,
    };
  }

  // Check if user has access to the team
  const userTeamMember = team.members.find(
    (member) => member.userId === session.user?.id
  );

  if (!userTeamMember) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Serialize team data
  const serializedTeam: SerializedTeam = {
    id: team.id,
    name: team.name,
    slug: team.slug,
    createdAt: team.createdAt.toISOString(),
    updatedAt: team.updatedAt.toISOString(),
    members: team.members.map((member) => ({
      id: member.id,
      userId: member.userId,
      teamId: member.teamId,
      role: member.role,
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString(),
      user: {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        image: member.user.image,
      },
    })),
  };

  return {
    props: {
      team: serializedTeam,
    },
  };
};

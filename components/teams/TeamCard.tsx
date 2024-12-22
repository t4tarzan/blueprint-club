import { Team, TeamMember } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface TeamCardProps {
  team: Team & {
    members?: TeamMember[];
  };
  isCurrentTeam?: boolean;
  onSwitchTeam?: (teamId: string) => void;
}

export function TeamCard({ team, isCurrentTeam, onSwitchTeam }: TeamCardProps) {
  const { data: session } = useSession();
  const userRole = team.members?.find(m => m.userId === session?.user?.id)?.role;

  return (
    <div className={`p-4 rounded-lg border ${
      isCurrentTeam ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{team.name}</h3>
          <p className="text-sm text-gray-500">{team.domain || team.slug}</p>
        </div>
        <div className="flex items-center space-x-2">
          {userRole && (
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
              {userRole.toLowerCase()}
            </span>
          )}
          {!isCurrentTeam && onSwitchTeam && (
            <button
              onClick={() => onSwitchTeam(team.id)}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
            >
              Switch
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-4">
          <Link
            href={`/teams/${team.slug}/members`}
            className="text-sm text-gray-600 hover:text-blue-600"
          >
            Members
          </Link>
          {(userRole === 'ADMIN' || userRole === 'OWNER') && (
            <>
              <Link
                href={`/teams/${team.slug}/settings`}
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Settings
              </Link>
              <Link
                href={`/teams/${team.slug}/sso`}
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                SSO
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

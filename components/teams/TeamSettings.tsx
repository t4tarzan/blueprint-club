import { useState } from 'react';
import { Team, TeamMember, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { TeamMembers } from './TeamMembers';
import { SAMLConfig } from './SAMLConfig';

interface TeamSettingsProps {
  team: Team & {
    members: (TeamMember & {
      user: User;
    })[];
  };
  onUpdate?: () => void;
}

export function TeamSettings({ team, onUpdate }: TeamSettingsProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('general');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentUserRole = team.members.find(
    m => m.userId === session?.user?.id
  )?.role;

  const canManageTeam = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  const handleUpdateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const domain = formData.get('domain') as string;

    try {
      const response = await fetch(`/api/teams/${team.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          domain,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update team');
      }

      setSuccess('Team settings updated successfully');
      onUpdate?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/teams/${team.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete team');
      }

      window.location.href = '/teams';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`${
              activeTab === 'members'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Members
          </button>
          {canManageTeam && (
            <button
              onClick={() => setActiveTab('sso')}
              className={`${
                activeTab === 'sso'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              SSO
            </button>
          )}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <form onSubmit={handleUpdateTeam} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Team Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  defaultValue={team.name}
                  disabled={!canManageTeam}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label
                  htmlFor="domain"
                  className="block text-sm font-medium text-gray-700"
                >
                  Domain
                </label>
                <input
                  type="text"
                  name="domain"
                  id="domain"
                  defaultValue={team.domain || ''}
                  disabled={!canManageTeam}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Used for automatic team assignment with SSO
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-4">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              {canManageTeam && (
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleDeleteTeam}
                    className="inline-flex justify-center rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete Team
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {activeTab === 'members' && (
          <TeamMembers team={team} onMemberUpdate={onUpdate} />
        )}

        {activeTab === 'sso' && canManageTeam && (
          <SAMLConfig team={team} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
}

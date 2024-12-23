import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Team, User, TeamMember } from '../../types';
import { useTranslation } from 'next-i18next';
import { TeamMembers } from './TeamMembers';

interface TeamSettingsProps {
  team: Team & {
    members: (TeamMember & {
      user: User;
    })[];
  };
  onUpdate?: () => void;
}

export function TeamSettings({ team, onUpdate }: TeamSettingsProps) {
  const { t } = useTranslation('common');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTeamUpdate = async (values: { name: string; domain?: string }) => {
    setError('');
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/teams/${team.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update team');
      }

      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update team');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {t('team-settings')}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {t('team-settings-description')}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <TeamMembers team={team} onMemberUpdate={onUpdate} />
      </div>
    </div>
  );
}

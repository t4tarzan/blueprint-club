import { useState } from 'react';
import { Team, User, TeamMember, Role } from '../../types';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

interface TeamMembersProps {
  team: Team & {
    members: (TeamMember & {
      user: User;
    })[];
  };
  onMemberUpdate?: () => void;
}

export function TeamMembers({ team, onMemberUpdate }: TeamMembersProps) {
  const { data: session } = useSession();
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState('');
  const currentUserRole = team.members.find(
    m => m.userId === session?.user?.id
  )?.role;

  const canManageMembers = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsInviting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const role = formData.get('role') as Role;

    try {
      const response = await fetch(`/api/teams/${team.id}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          role,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send invitation');
      }

      (e.target as HTMLFormElement).reset();
      onMemberUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/teams/${team.id}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove member');
      }

      onMemberUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member');
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: Role) => {
    try {
      const response = await fetch(`/api/teams/${team.id}/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: newRole,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update role');
      }

      onMemberUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update member role');
    }
  };

  return (
    <div className="space-y-6">
      {canManageMembers && (
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="member@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                name="role"
                id="role"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
                {currentUserRole === 'OWNER' && (
                  <option value="OWNER">Owner</option>
                )}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isInviting}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              {isInviting ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-medium">Team Members</h3>
        <div className="mt-4 divide-y divide-gray-200">
          {team.members.map(member => (
            <div
              key={member.id}
              className="flex items-center justify-between py-4"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {member.user.name || member.user.email}
                </p>
                <p className="text-sm text-gray-500">{member.user.email}</p>
              </div>
              <div className="flex items-center space-x-4">
                {canManageMembers && member.userId !== session?.user?.id && (
                  <>
                    <select
                      value={member.role}
                      onChange={e => handleUpdateRole(member.id, e.target.value as Role)}
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                      {currentUserRole === 'OWNER' && (
                        <option value="OWNER">Owner</option>
                      )}
                    </select>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </>
                )}
                {!canManageMembers && (
                  <span className="text-sm text-gray-500">{member.role}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

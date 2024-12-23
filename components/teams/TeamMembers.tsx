import { SerializedTeam, SerializedTeamMember } from '@/lib/types/prisma';
import { Role } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface TeamMembersProps {
  team: SerializedTeam;
  onUpdate?: () => void;
}

const TeamMembers = ({ team, onUpdate }: TeamMembersProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const currentUserRole = team.members.find(
    (member) => member.userId === session?.user?.id
  )?.role;

  const canManageMembers = currentUserRole === Role.ADMIN || currentUserRole === Role.OWNER;

  const handleRoleChange = async (memberId: string, newRole: Role) => {
    if (!canManageMembers) {
      toast({
        title: 'Permission denied',
        description: 'You do not have permission to manage team members.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/teams/${team.id}/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update member role');
      }

      onUpdate?.();
      toast({
        title: 'Role updated',
        description: 'Team member role has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update team member role.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!canManageMembers) {
      toast({
        title: 'Permission denied',
        description: 'You do not have permission to manage team members.',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm('Are you sure you want to remove this member?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/teams/${team.id}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      onUpdate?.();
      toast({
        title: 'Member removed',
        description: 'Team member has been removed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove team member.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Team Members</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              {canManageMembers && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {team.members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {member.user.image && (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={member.user.image}
                        alt={member.user.name || 'User avatar'}
                      />
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {member.user.name || 'Unnamed User'}
                      </div>
                      <div className="text-sm text-gray-500">{member.user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {canManageMembers && member.role !== Role.OWNER ? (
                    <select
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as Role)}
                      disabled={isLoading}
                    >
                      {Object.values(Role)
                        .filter((role) => role !== Role.OWNER)
                        .map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {member.role}
                    </span>
                  )}
                </td>
                {canManageMembers && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {member.role !== Role.OWNER && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMembers;

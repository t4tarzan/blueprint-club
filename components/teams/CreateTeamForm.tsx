import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { ApiErrorResponse } from '../../types';

interface CreateTeamFormProps {
  onSuccess?: () => void;
}

interface CreateTeamResponse {
  slug: string;
  [key: string]: unknown;
}

export function CreateTeamForm({ onSuccess }: CreateTeamFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const domain = formData.get('domain') as string;

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          domain,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorResponse = data as ApiErrorResponse;
        throw new Error(
          errorResponse.error?.message || 
          errorResponse.message || 
          'Failed to create team'
        );
      }

      const team = data as CreateTeamResponse;
      
      if (!team.slug) {
        throw new Error('Invalid team response: missing slug');
      }

      onSuccess?.();
      router.push(`/teams/${team.slug}/settings`);
    } catch (err) {
      console.error('Error creating team:', err);
      setError(err instanceof Error ? err.message : 'Failed to create team');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter team name"
        />
      </div>

      <div>
        <label
          htmlFor="domain"
          className="block text-sm font-medium text-gray-700"
        >
          Domain (optional)
        </label>
        <input
          type="text"
          name="domain"
          id="domain"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="company.com"
        />
        <p className="mt-1 text-sm text-gray-500">
          Used for automatic team assignment with SSO
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Creating...' : 'Create Team'}
      </button>
    </form>
  );
}

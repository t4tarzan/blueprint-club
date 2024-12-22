import { useState } from 'react';
import { Team } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface SAMLConfigProps {
  team: Team;
  onUpdate?: () => void;
}

interface SAMLConnection {
  encodedRawMetadata?: string;
  defaultRedirectUrl?: string;
  redirectUrl?: string;
  tenant: string;
  product: string;
}

export function SAMLConfig({ team, onUpdate }: SAMLConfigProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connection, setConnection] = useState<SAMLConnection | null>(null);

  const fetchSAMLConnection = async () => {
    try {
      const response = await fetch(`/api/teams/${team.id}/saml`);
      if (response.ok) {
        const data = await response.json();
        setConnection(data);
      }
    } catch (err) {
      console.error('Failed to fetch SAML connection:', err);
    }
  };

  // Fetch SAML connection on mount
  useState(() => {
    fetchSAMLConnection();
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const metadata = formData.get('metadata') as string;
    const redirectUrl = formData.get('redirectUrl') as string;

    try {
      const response = await fetch(`/api/teams/${team.id}/saml`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encodedRawMetadata: metadata,
          redirectUrl,
          tenant: team.slug,
          product: process.env.NEXT_PUBLIC_BOXYHQ_PRODUCT || 'blueprint-club',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to configure SAML');
      }

      setSuccess('SAML configuration updated successfully');
      onUpdate?.();
      fetchSAMLConnection();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">SAML Configuration</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure Single Sign-On (SSO) for your team using SAML 2.0
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="metadata"
            className="block text-sm font-medium text-gray-700"
          >
            IdP Metadata
          </label>
          <textarea
            name="metadata"
            id="metadata"
            rows={8}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Paste your IdP metadata XML here"
            defaultValue={connection?.encodedRawMetadata}
          />
        </div>

        <div>
          <label
            htmlFor="redirectUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Redirect URL (optional)
          </label>
          <input
            type="url"
            name="redirectUrl"
            id="redirectUrl"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="https://example.com/dashboard"
            defaultValue={connection?.redirectUrl}
          />
          <p className="mt-1 text-sm text-gray-500">
            Users will be redirected to this URL after successful login
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

        <div className="flex justify-between">
          <a
            href={`/api/auth/saml/metadata?tenant=${team.slug}&product=${
              process.env.NEXT_PUBLIC_BOXYHQ_PRODUCT || 'blueprint-club'
            }`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
          >
            Download SP Metadata
          </a>
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>

      {connection && (
        <div className="mt-8">
          <h4 className="text-sm font-medium text-gray-900">SAML Details</h4>
          <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Login URL</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {`${window.location.origin}/api/auth/saml/authorize?tenant=${
                  team.slug
                }&product=${
                  process.env.NEXT_PUBLIC_BOXYHQ_PRODUCT || 'blueprint-club'
                }`}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ACS URL</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {`${window.location.origin}/api/auth/saml/callback`}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Entity ID</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {`${window.location.origin}/api/auth/saml/metadata`}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

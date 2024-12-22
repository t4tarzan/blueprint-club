import { useState } from 'react';
import { Team } from '@prisma/client';
import { Switch } from '@headlessui/react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

interface SCIMConfigProps {
  team: Team;
  onUpdate: () => void;
}

export function SCIMConfig({ team, onUpdate }: SCIMConfigProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleSCIM = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/teams/${team.id}/scim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: !team.scimEnabled,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update SCIM configuration');
      }

      onUpdate();
    } catch (error) {
      setError('Failed to update SCIM configuration');
      console.error('SCIM toggle error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateToken = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/teams/${team.id}/scim/token`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate SCIM token');
      }

      onUpdate();
    } catch (error) {
      setError('Failed to regenerate SCIM token');
      console.error('SCIM token regeneration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Directory Sync (SCIM)
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Enable SCIM to automatically sync users and groups from your identity provider.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Enable SCIM</p>
          <p className="text-sm text-gray-500">
            Allow automatic user provisioning and deprovisioning
          </p>
        </div>
        <Switch
          checked={team.scimEnabled}
          onChange={handleToggleSCIM}
          disabled={isLoading}
          className={`${
            team.scimEnabled ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              team.scimEnabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {team.scimEnabled && (
        <>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SCIM Base URL
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    readOnly
                    value={`${process.env.NEXT_PUBLIC_APP_URL}/api/scim/v2.0`}
                    className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `${process.env.NEXT_PUBLIC_APP_URL}/api/scim/v2.0`
                      )
                    }
                    className="ml-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {copied ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ClipboardIcon className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bearer Token
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="password"
                    readOnly
                    value={team.scimToken || ''}
                    className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(team.scimToken || '')}
                    className="ml-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {copied ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ClipboardIcon className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRegenerateToken}
                disabled={isLoading}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Regenerate Token
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  SCIM Configuration Guide
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>
                      Use the SCIM Base URL and Bearer Token to configure SCIM in
                      your identity provider.
                    </li>
                    <li>
                      Supported identity providers: Azure AD, Okta, and OneLogin.
                    </li>
                    <li>
                      User attributes will be automatically mapped to your team
                      members.
                    </li>
                    <li>
                      Groups will be synchronized and maintained automatically.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
    </div>
  );
}

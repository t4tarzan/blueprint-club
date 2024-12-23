import { useState } from 'react';
import { WebhookForm, WebhookFormValues } from '@/components/webhook/webhook-form';
import { WebhookService } from '@/lib/webhook/webhook-service';
import { Webhook } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { getSession } from 'next-auth/react';
import { hasTeamRole } from '@/lib/boxyhq/utils';
import { ExtendedSession } from '@/lib/auth/config';

interface WebhookWithName extends Webhook {
  name: string;
}

interface WebhooksPageProps {
  webhooks: WebhookWithName[];
  teamId: string;
}

const webhookService = WebhookService.getInstance();

export default function WebhooksPage({ webhooks: initialWebhooks, teamId }: WebhooksPageProps) {
  const [webhooks, setWebhooks] = useState<WebhookWithName[]>(initialWebhooks);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookWithName | undefined>();

  const handleSubmit = async (values: WebhookFormValues) => {
    if (selectedWebhook) {
      const updatedWebhook = await webhookService.update(selectedWebhook.id, {
        ...values,
        teamId,
      });
      setWebhooks(webhooks.map(w => w.id === updatedWebhook.id ? { ...updatedWebhook, name: values.name } : w));
      setSelectedWebhook(undefined);
    } else {
      const newWebhook = await webhookService.create({
        ...values,
        teamId,
      });
      setWebhooks([...webhooks, { ...newWebhook, name: values.name }]);
    }
  };

  const handleDelete = async (id: string) => {
    await webhookService.delete(id);
    setWebhooks(webhooks.filter(w => w.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Webhooks</h1>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedWebhook ? 'Edit Webhook' : 'Create Webhook'}
          </h2>
          <WebhookForm
            webhook={selectedWebhook}
            onSubmit={handleSubmit}
          />
        </div>
        {webhooks.map(webhook => (
          <div key={webhook.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{webhook.name}</h3>
              <div className="space-x-2">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(webhook.id)}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => setSelectedWebhook(webhook)}
                >
                  Edit
                </Button>
              </div>
            </div>
            <p className="text-gray-600">{webhook.url}</p>
            <p className="text-sm text-gray-500 mt-2">
              {webhook.description}
            </p>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Events:</h4>
              <div className="mt-1 space-x-2">
                {webhook.events.map(event => (
                  <span
                    key={event}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {event}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context) as ExtendedSession | null;
  const teamId = context.query.teamId as string;

  if (!session || !hasTeamRole(session.user?.id, teamId, ['OWNER', 'ADMIN'])) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const webhooks = await webhookService.findByTeam(teamId);

  return {
    props: {
      webhooks,
      teamId,
    },
  };
}

import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WebhookForm } from './WebhookForm';
import { WebhookDeliveryList } from './WebhookDeliveryList';
import { toast } from 'react-hot-toast';

interface Webhook {
  id: string;
  url: string;
  description?: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
}

interface WebhookListProps {
  teamId: string;
}

export function WebhookList({ teamId }: WebhookListProps) {
  const { t } = useTranslation(['common', 'webhooks']);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [showDeliveries, setShowDeliveries] = useState<string | null>(null);

  const fetchWebhooks = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}/webhooks`);
      if (!response.ok) throw new Error('Failed to fetch webhooks');
      const data = await response.json();
      setWebhooks(data);
    } catch (error) {
      toast.error('Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, [teamId]);

  const handleDelete = async (webhookId: string) => {
    if (!confirm(t('webhooks:deleteConfirmation'))) return;

    try {
      const response = await fetch(
        `/api/teams/${teamId}/webhooks/${webhookId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete webhook');

      toast.success(t('webhooks:webhookDeleted'));
      fetchWebhooks();
    } catch (error) {
      toast.error('Failed to delete webhook');
    }
  };

  if (loading) {
    return <div className="text-center">{t('common:loading')}</div>;
  }

  return (
    <div className="space-y-4">
      {webhooks.map((webhook) => (
        <Card key={webhook.id}>
          {editingWebhook?.id === webhook.id ? (
            <WebhookForm
              teamId={teamId}
              webhook={webhook}
              onCancel={() => setEditingWebhook(null)}
              onSuccess={() => {
                setEditingWebhook(null);
                fetchWebhooks();
              }}
            />
          ) : (
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">{webhook.url}</h3>
                  {webhook.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {webhook.description}
                    </p>
                  )}
                </div>
                <Badge variant={webhook.isActive ? 'default' : 'secondary'}>
                  {webhook.isActive ? t('active') : t('inactive')}
                </Badge>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium">
                  {t('webhooks:subscribedEvents')}
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {webhook.events.map((event) => (
                    <Badge key={event} variant="secondary">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingWebhook(webhook)}
                  >
                    {t('common:edit')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(webhook.id)}
                  >
                    {t('common:delete')}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setShowDeliveries(
                      showDeliveries === webhook.id ? null : webhook.id
                    )
                  }
                >
                  {t('webhooks:viewDeliveries')}
                </Button>
              </div>

              {showDeliveries === webhook.id && (
                <div className="mt-4 border-t pt-4">
                  <WebhookDeliveryList
                    teamId={teamId}
                    webhookId={webhook.id}
                  />
                </div>
              )}
            </div>
          )}
        </Card>
      ))}

      {webhooks.length === 0 && (
        <div className="text-center text-gray-500">
          {t('webhooks:noWebhooks')}
        </div>
      )}
    </div>
  );
}

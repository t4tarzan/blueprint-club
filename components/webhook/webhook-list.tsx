import { useState } from 'react';
import { Webhook, WebhookListProps } from '@/lib/types/webhook';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WebhookForm } from './webhook-form';
import { useTranslation } from 'next-i18next';

export function WebhookList({ webhooks, onDelete, onUpdate }: WebhookListProps) {
  const { t } = useTranslation('common');
  const [showForm, setShowForm] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);

  const handleEdit = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setShowForm(true);
  };

  const handleDelete = async (webhook: Webhook) => {
    if (window.confirm(t('webhook.confirmDelete'))) {
      await onDelete(webhook.id);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (selectedWebhook && onUpdate) {
      await onUpdate({ ...selectedWebhook, ...data });
    }
    setShowForm(false);
    setSelectedWebhook(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedWebhook(null);
  };

  if (showForm) {
    return (
      <Card className="p-6">
        <WebhookForm
          webhook={selectedWebhook}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          events={[]}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {webhooks.map((webhook) => (
        <Card key={webhook.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{webhook.url}</h3>
              <div className="mt-1 text-sm text-gray-500">
                <p>Events: {webhook.events.join(', ')}</p>
                <p>
                  Status:{' '}
                  <span
                    className={`font-medium ${
                      webhook.active ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {webhook.active ? t('common.active') : t('common.inactive')}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(webhook)}
              >
                {t('common.edit')}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(webhook)}
              >
                {t('common.delete')}
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {webhooks.length === 0 && (
        <Card className="p-4">
          <p className="text-center text-gray-500">
            {t('webhook.noWebhooks')}
          </p>
        </Card>
      )}
    </div>
  );
}

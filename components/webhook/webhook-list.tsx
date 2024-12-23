import { useState } from 'react';
import { Webhook, WebhookListProps } from '@/lib/types/webhook';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WebhookForm } from './webhook-form';
import { WebhookDeliveryList } from './webhook-delivery-list';

export function WebhookList({ webhooks, onDelete, onUpdate }: WebhookListProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [showDeliveries, setShowDeliveries] = useState<string | null>(null);

  const handleSubmit = async (webhook: Webhook) => {
    try {
      await onUpdate(webhook);
      setShowForm(false);
      setSelectedWebhook(null);
    } catch (error) {
      console.error('Failed to update webhook:', error);
    }
  };

  const handleDelete = async (webhook: Webhook) => {
    try {
      await onDelete(webhook);
    } catch (error) {
      console.error('Failed to delete webhook:', error);
    }
  };

  const handleEdit = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setShowForm(true);
  };

  const handleToggleDeliveries = (webhookId: string) => {
    setShowDeliveries(showDeliveries === webhookId ? null : webhookId);
  };

  if (showForm) {
    return (
      <WebhookForm
        webhook={selectedWebhook || undefined}
        onSubmit={handleSubmit}
        onCancel={() => {
          setShowForm(false);
          setSelectedWebhook(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Webhooks</h2>
        <Button onClick={() => setShowForm(true)}>Add Webhook</Button>
      </div>

      {webhooks.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-gray-500">No webhooks configured</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <Card key={webhook.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{webhook.url}</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    <p>Events: {webhook.events.join(', ')}</p>
                    <p>
                      Status:{' '}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          webhook.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {webhook.active ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleDeliveries(webhook.id)}
                  >
                    {showDeliveries === webhook.id
                      ? 'Hide Deliveries'
                      : 'Show Deliveries'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(webhook)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(webhook)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {showDeliveries === webhook.id && (
                <div className="mt-4">
                  <WebhookDeliveryList webhookId={webhook.id} />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

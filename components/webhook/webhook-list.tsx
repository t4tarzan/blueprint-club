import { useState } from 'react';
import { WebhookDelivery } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WebhookForm } from './webhook-form';
import { WebhookDeliveryList } from './webhook-delivery-list';
import { toast } from 'react-hot-toast';

interface Webhook {
  id: string;
  url: string;
  secret: string;
  active: boolean;
  events: string[];
  createdAt: Date;
  updatedAt: Date;
  teamId: string;
  deliveries?: WebhookDelivery[];
}

interface WebhookListProps {
  webhooks: Webhook[];
  teamId: string;
}

export function WebhookList({ webhooks, teamId }: WebhookListProps) {
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleWebhookCreate = async (webhook: Webhook) => {
    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...webhook, teamId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create webhook');
      }

      toast.success('Webhook created successfully');
      setShowForm(false);
    } catch (error) {
      console.error('Error creating webhook:', error);
      toast.error('Failed to create webhook');
    }
  };

  const handleWebhookUpdate = async (webhook: Webhook) => {
    try {
      const response = await fetch(`/api/webhooks/${webhook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhook),
      });

      if (!response.ok) {
        throw new Error('Failed to update webhook');
      }

      toast.success('Webhook updated successfully');
      setSelectedWebhook(null);
    } catch (error) {
      console.error('Error updating webhook:', error);
      toast.error('Failed to update webhook');
    }
  };

  const handleWebhookDelete = async (webhookId: string) => {
    try {
      const response = await fetch(`/api/webhooks/${webhookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete webhook');
      }

      toast.success('Webhook deleted successfully');
      setSelectedWebhook(null);
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast.error('Failed to delete webhook');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Webhooks</h2>
        <Button onClick={() => setShowForm(true)}>Create Webhook</Button>
      </div>

      {showForm && (
        <Card className="p-4">
          <WebhookForm
            onSubmit={handleWebhookCreate}
            onCancel={() => setShowForm(false)}
          />
        </Card>
      )}

      {webhooks.map((webhook) => (
        <Card key={webhook.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">{webhook.url}</h3>
              <div className="mt-1 flex items-center space-x-2">
                <Badge variant={webhook.active ? 'default' : 'secondary'}>
                  {webhook.active ? 'Active' : 'Inactive'}
                </Badge>
                <span className="text-sm text-gray-500">
                  {webhook.events.join(', ')}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setSelectedWebhook(webhook)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleWebhookDelete(webhook.id)}
              >
                Delete
              </Button>
            </div>
          </div>

          {selectedWebhook?.id === webhook.id && (
            <div className="mt-4">
              <WebhookForm
                webhook={webhook}
                onSubmit={handleWebhookUpdate}
                onCancel={() => setSelectedWebhook(null)}
              />
            </div>
          )}

          {webhook.deliveries && webhook.deliveries.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Recent Deliveries</h4>
              <WebhookDeliveryList deliveries={webhook.deliveries} />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

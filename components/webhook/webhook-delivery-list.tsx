import { useState, useEffect } from 'react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WebhookDelivery } from '@/lib/types/webhook';

interface WebhookDeliveryListProps {
  webhookId: string;
}

export function WebhookDeliveryList({ webhookId }: WebhookDeliveryListProps) {
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeliveries();
  }, [webhookId]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/webhooks/${webhookId}/deliveries`);
      if (!response.ok) {
        throw new Error('Failed to fetch webhook deliveries');
      }
      const data = await response.json();
      setDeliveries(data);
    } catch (error) {
      console.error('Error fetching webhook deliveries:', error);
      setError('Failed to load webhook deliveries');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card className="p-4">
        <p className="text-center text-gray-500">Loading deliveries...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <Button onClick={fetchDeliveries}>Retry</Button>
        </div>
      </Card>
    );
  }

  if (deliveries.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-center text-gray-500">No deliveries found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {deliveries.map((delivery) => (
        <Card key={delivery.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <span className={getStatusColor(delivery.statusCode)}>
                  {delivery.statusCode}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(delivery.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-sm">
                {delivery.error || 'Delivery successful'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // TODO: Implement delivery details view
                console.log('View delivery details:', delivery);
              }}
            >
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

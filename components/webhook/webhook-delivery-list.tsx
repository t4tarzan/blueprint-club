import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WebhookDelivery } from '@/lib/types/webhook';

interface WebhookDeliveryListProps {
  webhookId: string;
}

export function WebhookDeliveryList({ webhookId }: WebhookDeliveryListProps) {
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [loading, setLoading] = useState(false);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Recent Deliveries</h2>
      {deliveries.length === 0 ? (
        <p>No deliveries found</p>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <Card key={delivery.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{delivery.event}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(delivery.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${getStatusColor(delivery.responseStatus)}`}>
                    Status: {delivery.responseStatus}
                  </p>
                  {delivery.error && (
                    <p className="text-sm text-red-500">Error: {delivery.error}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) {
    return 'text-green-500';
  } else if (status >= 400 && status < 500) {
    return 'text-yellow-500';
  } else {
    return 'text-red-500';
  }
}

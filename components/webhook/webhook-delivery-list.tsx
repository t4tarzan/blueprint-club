import { useState } from 'react';
import { WebhookDelivery } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface WebhookDeliveryListProps {
  deliveries: WebhookDelivery[];
}

export function WebhookDeliveryList({ deliveries }: WebhookDeliveryListProps) {
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="space-y-4">
      {deliveries.map((delivery) => (
        <Card key={delivery.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={delivery.statusCode === 200 ? 'default' : 'destructive'}
                >
                  {delivery.statusCode === 200 ? 'Success' : 'Failed'}
                </Badge>
                <span className="text-sm text-gray-500">
                  {delivery.event} • {formatDate(delivery.createdAt)}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-sm">
                  Duration: {delivery.duration}ms • Status: {delivery.statusCode}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                setSelectedDelivery(
                  selectedDelivery === delivery.id ? null : delivery.id
                )
              }
            >
              {selectedDelivery === delivery.id ? 'Hide Details' : 'View Details'}
            </Button>
          </div>

          {selectedDelivery === delivery.id && (
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Request Headers</h4>
                <pre className="text-sm bg-gray-100 p-2 rounded">
                  {JSON.stringify(delivery.requestHeaders, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Request Body</h4>
                <pre className="text-sm bg-gray-100 p-2 rounded">
                  {delivery.requestBody}
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Response Headers</h4>
                <pre className="text-sm bg-gray-100 p-2 rounded">
                  {JSON.stringify(delivery.responseHeaders, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Response Body</h4>
                <pre className="text-sm bg-gray-100 p-2 rounded">
                  {delivery.responseBody}
                </pre>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

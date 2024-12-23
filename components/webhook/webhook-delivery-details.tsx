import { WebhookDelivery } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

interface WebhookDeliveryDetailsProps {
  delivery: WebhookDelivery;
}

export function WebhookDeliveryDetails({ delivery }: WebhookDeliveryDetailsProps) {
  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Event</h3>
        <p className="mt-1 text-sm text-gray-500">{delivery.event}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900">URL</h3>
        <p className="mt-1 text-sm text-gray-500">{delivery.url}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900">Status</h3>
        <div className="mt-1">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              delivery.success
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {delivery.success ? 'Success' : 'Failed'}
          </span>
          {delivery.statusCode && (
            <span className="ml-2 text-sm text-gray-500">
              Status code: {delivery.statusCode}
            </span>
          )}
        </div>
      </div>

      {delivery.error && (
        <div>
          <h3 className="text-sm font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-red-500">{delivery.error}</p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-gray-900">Request Body</h3>
        <pre className="mt-1 p-2 bg-gray-50 rounded-md text-sm overflow-auto">
          {JSON.stringify(delivery.requestBody, null, 2)}
        </pre>
      </div>

      {delivery.responseBody && (
        <div>
          <h3 className="text-sm font-medium text-gray-900">Response Body</h3>
          <pre className="mt-1 p-2 bg-gray-50 rounded-md text-sm overflow-auto">
            {JSON.stringify(delivery.responseBody, null, 2)}
          </pre>
        </div>
      )}

      <div className="flex justify-between text-sm text-gray-500">
        <span>Duration: {delivery.duration}ms</span>
        <span>Delivered at: {formatDate(delivery.createdAt)}</span>
      </div>
    </Card>
  );
}

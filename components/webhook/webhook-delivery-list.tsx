import { WebhookDelivery } from '@prisma/client';
import { formatDate } from '@/lib/utils';

interface WebhookDeliveryListProps {
  deliveries: WebhookDelivery[];
  onSelect: (delivery: WebhookDelivery) => void;
}

export function WebhookDeliveryList({ deliveries, onSelect }: WebhookDeliveryListProps) {
  return (
    <div className="space-y-2">
      {deliveries.map((delivery) => (
        <button
          key={delivery.id}
          onClick={() => onSelect(delivery)}
          className="w-full text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    delivery.success
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {delivery.success ? 'Success' : 'Failed'}
                </span>
                <span className="text-sm text-gray-500 truncate">
                  {delivery.event}
                </span>
              </div>
              <div className="mt-1">
                <p className="text-sm text-gray-900 truncate">{delivery.url}</p>
                {delivery.statusCode && (
                  <p className="text-sm text-gray-500">
                    Status code: {delivery.statusCode}
                  </p>
                )}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <div className="text-sm text-gray-500">
                {formatDate(delivery.createdAt)}
              </div>
              <div className="text-sm text-gray-500">
                Duration: {delivery.duration}ms
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

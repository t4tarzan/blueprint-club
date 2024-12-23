import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface WebhookDelivery {
  id: string;
  event: string;
  payload: any;
  statusCode: number;
  success: boolean;
  error?: string;
  createdAt: string;
}

interface WebhookDeliveryListProps {
  teamId: string;
  webhookId: string;
}

export function WebhookDeliveryList({
  teamId,
  webhookId,
}: WebhookDeliveryListProps) {
  const { t } = useTranslation(['common', 'webhooks']);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);

  const fetchDeliveries = async (pageNum: number) => {
    try {
      const response = await fetch(
        `/api/teams/${teamId}/webhooks/${webhookId}/deliveries?page=${pageNum}`
      );
      if (!response.ok) throw new Error('Failed to fetch deliveries');
      const data = await response.json();
      if (pageNum === 1) {
        setDeliveries(data.deliveries);
      } else {
        setDeliveries((prev) => [...prev, ...data.deliveries]);
      }
      setHasMore(data.pagination.page < data.pagination.pages);
    } catch (error) {
      console.error('Failed to load webhook deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries(1);
  }, [teamId, webhookId]);

  if (loading) {
    return <div className="text-center py-4">{t('common:loading')}</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('webhooks:deliveryHistory')}</h3>

      <div className="space-y-2">
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="border rounded-lg p-4 space-y-2 bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge
                  variant={delivery.success ? 'default' : 'destructive'}
                  className="uppercase"
                >
                  {delivery.statusCode}
                </Badge>
                <span className="text-sm font-medium">
                  {t(`webhooks:events.${delivery.event}`)}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(delivery.createdAt), 'PPp')}
              </span>
            </div>

            {selectedDelivery === delivery.id && (
              <div className="mt-2 space-y-2">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">
                    {t('webhooks:payload')}
                  </h4>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                    {JSON.stringify(delivery.payload, null, 2)}
                  </pre>
                </div>

                {delivery.error && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-red-600">
                      {t('webhooks:error')}
                    </h4>
                    <pre className="bg-red-50 p-2 rounded text-sm text-red-600 overflow-x-auto">
                      {delivery.error}
                    </pre>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSelectedDelivery(
                    selectedDelivery === delivery.id ? null : delivery.id
                  )
                }
              >
                {selectedDelivery === delivery.id
                  ? t('common:hide')
                  : t('common:details')}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {deliveries.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          {t('webhooks:noDeliveries')}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            onClick={() => {
              setPage((p) => p + 1);
              fetchDeliveries(page + 1);
            }}
          >
            {t('common:loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
}

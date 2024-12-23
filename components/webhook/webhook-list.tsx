import { useState } from 'react';
import { Webhook } from '@prisma/client';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { useTranslation } from 'next-i18next';

export interface WebhookListProps {
  webhooks: Webhook[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (webhook: Webhook) => Promise<void>;
}

export function WebhookList({ webhooks, onDelete, onUpdate }: WebhookListProps) {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const handleToggleActive = async (webhook: Webhook) => {
    try {
      setLoading((prev) => ({ ...prev, [webhook.id]: true }));
      await onUpdate({
        ...webhook,
        isActive: !webhook.isActive,
      });
    } catch (error) {
      console.error('Error toggling webhook:', error);
    } finally {
      setLoading((prev) => ({ ...prev, [webhook.id]: false }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('webhook.confirmDelete'))) return;
    try {
      setLoading((prev) => ({ ...prev, [id]: true }));
      await onDelete(id);
    } catch (error) {
      console.error('Error deleting webhook:', error);
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (webhooks.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">{t('webhook.noWebhooks')}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>URL</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Events</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Active</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {webhooks.map((webhook) => (
          <TableRow key={webhook.id}>
            <TableCell className="font-medium">{webhook.url}</TableCell>
            <TableCell>{webhook.description || '-'}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {webhook.events.map((event) => (
                  <span
                    key={event}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100"
                  >
                    {event}
                  </span>
                ))}
              </div>
            </TableCell>
            <TableCell>{formatDate(webhook.createdAt)}</TableCell>
            <TableCell>
              <Switch
                checked={!!webhook.isActive}
                onCheckedChange={() => handleToggleActive(webhook)}
                disabled={loading[webhook.id]}
              />
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(webhook.id)}
                disabled={loading[webhook.id]}
              >
                {t('common.delete')}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

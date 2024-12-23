import { useState } from 'react';
import { WebhookFormProps, WebhookEvent } from '@/lib/types/webhook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'next-i18next';

export function WebhookForm({ webhook, onSubmit, onCancel, events }: WebhookFormProps) {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    url: webhook?.url || '',
    secret: webhook?.secret || '',
    events: webhook?.events || [],
    enabled: webhook?.enabled ?? true,
  });

  const availableEvents: WebhookEvent[] = [
    { id: 'user.created', name: 'User Created', description: 'When a new user is created' },
    { id: 'user.updated', name: 'User Updated', description: 'When a user is updated' },
    { id: 'user.deleted', name: 'User Deleted', description: 'When a user is deleted' },
    { id: 'team.created', name: 'Team Created', description: 'When a new team is created' },
    { id: 'team.updated', name: 'Team Updated', description: 'When a team is updated' },
    { id: 'team.deleted', name: 'Team Deleted', description: 'When a team is deleted' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const toggleEvent = (eventId: string) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter((e) => e !== eventId)
        : [...prev.events, eventId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium">
            {t('webhook.url')}
          </label>
          <Input
            id="url"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
            placeholder="https://your-domain.com/webhook"
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="secret" className="block text-sm font-medium">
            {t('webhook.secret')}
          </label>
          <Input
            id="secret"
            type="text"
            value={formData.secret}
            onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
            required
            placeholder="webhook-secret"
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('webhook.events')}
          </label>
          <div className="space-y-2">
            {availableEvents.map((event) => (
              <div key={event.id} className="flex items-center">
                <Checkbox
                  id={event.id}
                  checked={formData.events.includes(event.id)}
                  onCheckedChange={() => toggleEvent(event.id)}
                />
                <label htmlFor={event.id} className="ml-2 text-sm">
                  {event.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <Checkbox
            id="enabled"
            checked={formData.enabled}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, enabled: checked as boolean })
            }
          />
          <label htmlFor="enabled" className="ml-2 text-sm">
            {t('webhook.enabled')}
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit">
          {webhook ? t('common.update') : t('common.create')}
        </Button>
      </div>
    </form>
  );
}

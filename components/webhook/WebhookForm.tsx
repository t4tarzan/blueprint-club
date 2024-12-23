import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { Select } from '@/components/ui/select';
import { WebhookEvents } from '@/lib/webhook/webhook-events';
import { toast } from 'react-hot-toast';

interface WebhookFormProps {
  teamId: string;
  webhook?: {
    id: string;
    url: string;
    description?: string;
    events: string[];
    isActive: boolean;
  };
  onCancel: () => void;
  onSuccess: () => void;
}

export function WebhookForm({
  teamId,
  webhook,
  onCancel,
  onSuccess,
}: WebhookFormProps) {
  const { t } = useTranslation(['common', 'webhooks']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    url: webhook?.url || '',
    description: webhook?.description || '',
    events: webhook?.events || [],
    isActive: webhook?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = webhook
        ? `/api/teams/${teamId}/webhooks/${webhook.id}`
        : `/api/teams/${teamId}/webhooks`;
      const method = webhook ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }

      toast.success(
        t(webhook ? 'webhooks:webhookUpdated' : 'webhooks:webhookCreated')
      );
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label={t('webhooks:form.url')}
          type="url"
          required
          value={formData.url}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, url: e.target.value }))
          }
          placeholder="https://example.com/webhook"
        />
        <p className="mt-1 text-sm text-gray-500">
          {t('webhooks:form.urlDescription')}
        </p>
      </div>

      <div>
        <Input
          label={t('webhooks:form.description')}
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder={t('webhooks:form.descriptionPlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('webhooks:form.events')}
        </label>
        <div className="mt-2 space-y-2">
          {Object.entries(WebhookEvents).map(([category, events]) => (
            <div key={category} className="space-y-2">
              <h4 className="font-medium">{t(`webhooks:events.${category}`)}</h4>
              <div className="grid grid-cols-2 gap-2">
                {events.map((event) => (
                  <label
                    key={event}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formData.events.includes(event)}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          events: e.target.checked
                            ? [...prev.events, event]
                            : prev.events.filter((e) => e !== event),
                        }));
                      }}
                      className="rounded border-gray-300"
                    />
                    <span>{t(`webhooks:events.${event}`)}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Toggle
          label={t('webhooks:form.active')}
          checked={formData.isActive}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, isActive: value }))
          }
        />
        <p className="mt-1 text-sm text-gray-500">
          {t('webhooks:form.activeDescription')}
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t('common:cancel')}
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {t(webhook ? 'common:save' : 'common:create')}
        </Button>
      </div>
    </form>
  );
}

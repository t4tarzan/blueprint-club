import { useState } from 'react';
import { WebhookFormProps, WebhookEvent } from '@/lib/types/webhook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Webhook {
  id?: string;
  url: string;
  secret: string;
  active: boolean;
  events: WebhookEvent[];
  teamId?: string;
}

export function WebhookForm({ webhook, onSubmit, onCancel }: WebhookFormProps) {
  const [url, setUrl] = useState(webhook?.url || '');
  const [secret, setSecret] = useState(webhook?.secret || '');
  const [active, setActive] = useState(webhook?.active ?? true);
  const [events, setEvents] = useState<WebhookEvent[]>(webhook?.events || []);

  const webhookEvents: WebhookEvent[] = [
    'team.create',
    'team.update',
    'team.delete',
    'member.add',
    'member.remove',
    'member.update',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...(webhook?.id ? { id: webhook.id } : {}),
      url,
      secret,
      active,
      events,
    });
  };

  const toggleEvent = (event: WebhookEvent) => {
    if (events.includes(event)) {
      setEvents(events.filter((e) => e !== event));
    } else {
      setEvents([...events, event]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="url">Webhook URL</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/webhook"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="secret">Secret</Label>
        <Input
          id="secret"
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="webhook_secret"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Events</Label>
        <div className="grid grid-cols-2 gap-4">
          {webhookEvents.map((event) => (
            <div key={event} className="flex items-center space-x-2">
              <Checkbox
                id={event}
                checked={events.includes(event)}
                onCheckedChange={() => toggleEvent(event)}
              />
              <Label htmlFor={event}>{event}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="active"
            checked={active}
            onCheckedChange={(checked: boolean) => setActive(checked)}
          />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {webhook ? 'Update Webhook' : 'Create Webhook'}
        </Button>
      </div>
    </form>
  );
}

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Webhook {
  id?: string;
  url: string;
  secret: string;
  active: boolean;
  events: string[];
  teamId?: string;
}

interface WebhookFormProps {
  webhook?: Webhook;
  onSubmit: (webhook: Webhook) => void;
  onCancel: () => void;
}

const AVAILABLE_EVENTS = [
  'user.created',
  'user.updated',
  'user.deleted',
  'team.created',
  'team.updated',
  'team.deleted',
  'team.member.added',
  'team.member.removed',
  'team.member.updated',
];

export function WebhookForm({ webhook, onSubmit, onCancel }: WebhookFormProps) {
  const [url, setUrl] = useState(webhook?.url || '');
  const [secret, setSecret] = useState(webhook?.secret || '');
  const [active, setActive] = useState(webhook?.active ?? true);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    webhook?.events || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: Webhook = {
      ...(webhook?.id ? { id: webhook.id } : {}),
      url,
      secret,
      active,
      events: selectedEvents,
    };

    onSubmit(formData);
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event)
        ? prev.filter((e) => e !== event)
        : [...prev, event]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="url">Webhook URL</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://example.com/webhook"
        />
      </div>

      <div>
        <Label htmlFor="secret">Webhook Secret</Label>
        <Input
          id="secret"
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          required
          placeholder="Enter a secret key"
        />
      </div>

      <div>
        <Label>
          <Checkbox
            checked={active}
            onCheckedChange={(checked) => setActive(checked as boolean)}
          />
          <span className="ml-2">Active</span>
        </Label>
      </div>

      <div>
        <Label>Events</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {AVAILABLE_EVENTS.map((event) => (
            <Label key={event} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedEvents.includes(event)}
                onCheckedChange={() => toggleEvent(event)}
              />
              <span>{event}</span>
            </Label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
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

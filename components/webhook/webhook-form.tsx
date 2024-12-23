import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Webhook } from '@prisma/client';

const webhookFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Must be a valid URL'),
  description: z.string().optional(),
  events: z.array(z.string()),
  isActive: z.boolean(),
});

export type WebhookFormValues = z.infer<typeof webhookFormSchema>;

export interface WebhookFormProps {
  webhook?: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    teamId: string;
    url: string;
    events: string[];
    isActive: boolean;
    secret: string | null;
  };
  onSubmit: (values: WebhookFormValues) => Promise<void>;
}

const AVAILABLE_EVENTS = [
  'user.created',
  'user.updated',
  'user.deleted',
  'team.created',
  'team.updated',
  'team.deleted',
  'member.added',
  'member.removed',
  'member.updated',
];

export const WebhookForm: React.FC<WebhookFormProps> = ({ webhook, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      name: webhook?.name || '',
      url: webhook?.url || '',
      description: webhook?.description || '',
      events: webhook?.events || [],
      isActive: webhook?.isActive ?? true,
    },
  });

  const selectedEvents = watch('events');

  const handleFormSubmit = async (values: WebhookFormValues) => {
    try {
      setIsLoading(true);
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting webhook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <Input
          id="name"
          type="text"
          {...register('name')}
          className="mt-1"
          error={errors.name?.message}
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          Webhook URL
        </label>
        <Input
          id="url"
          type="url"
          {...register('url')}
          className="mt-1"
          error={errors.url?.message}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (optional)
        </label>
        <Textarea
          id="description"
          {...register('description')}
          className="mt-1"
          error={errors.description?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Events</label>
        <div className="mt-2 space-y-2">
          {AVAILABLE_EVENTS.map((event) => (
            <div key={event} className="flex items-center">
              <Checkbox
                id={event}
                checked={selectedEvents?.includes(event)}
                onCheckedChange={(checked) => {
                  const currentEvents = selectedEvents || [];
                  if (checked) {
                    setValue('events', [...currentEvents, event]);
                  } else {
                    setValue(
                      'events',
                      currentEvents.filter((e) => e !== event)
                    );
                  }
                }}
              />
              <label htmlFor={event} className="ml-2 text-sm text-gray-600">
                {event}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <Checkbox
          id="isActive"
          checked={watch('isActive')}
          onCheckedChange={(checked) => setValue('isActive', !!checked)}
        />
        <label htmlFor="isActive" className="ml-2 text-sm text-gray-600">
          Active
        </label>
      </div>

      <Button type="submit" disabled={isLoading}>
        {webhook ? 'Update Webhook' : 'Create Webhook'}
      </Button>
    </form>
  );
};

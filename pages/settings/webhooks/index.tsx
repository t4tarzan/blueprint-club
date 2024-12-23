import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SettingsLayout } from '@/components/layouts/settings-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { Select } from '@/components/ui/select';
import { WebhookList } from '@/components/webhook/webhook-list';
import { WebhookForm } from '@/components/webhook/webhook-form';
import { WebhookEvents } from '../../../lib/webhook/webhook-events';
import { hasTeamRole } from '../../../lib/boxyhq/utils';

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  const teamId = session.user.teamId;
  if (!teamId) {
    return {
      redirect: {
        destination: '/teams',
        permanent: false,
      },
    };
  }

  const hasPermission = await hasTeamRole({
    userId: session.user.id,
    teamId,
    roles: ['OWNER', 'ADMIN'],
  });

  if (!hasPermission) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', [
        'common',
        'settings',
        'webhooks',
      ])),
      teamId,
    },
  };
};

export default function WebhookSettings({ teamId }: { teamId: string }) {
  const { t } = useTranslation(['common', 'settings', 'webhooks']);
  const [showForm, setShowForm] = useState(false);

  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t('webhooks:title')}</h2>
            <p className="text-gray-500">{t('webhooks:description')}</p>
          </div>
          <Button onClick={() => setShowForm(true)} disabled={showForm}>
            {t('webhooks:addWebhook')}
          </Button>
        </div>

        {showForm && (
          <Card>
            <WebhookForm
              teamId={teamId}
              onCancel={() => setShowForm(false)}
              onSuccess={() => setShowForm(false)}
            />
          </Card>
        )}

        <WebhookList teamId={teamId} />
      </div>
    </SettingsLayout>
  );
}

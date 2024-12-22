import Link from 'next/link';
import { useTranslation } from 'next-i18next';

interface AgreeMessageProps {
  action: string;
}

const AgreeMessage: React.FC<AgreeMessageProps> = ({ action }) => {
  const { t } = useTranslation('common');

  return (
    <p className="text-sm text-gray-500">
      {t('by')} {action.toLowerCase()}, {t('you-agree-to')}{' '}
      <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
        {t('terms-of-service')}
      </Link>{' '}
      {t('and')}{' '}
      <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
        {t('privacy-policy')}
      </Link>
    </p>
  );
};

export default AgreeMessage;

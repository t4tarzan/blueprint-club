import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import useInvitation from 'hooks/useInvitation';
import env from '@/lib/env';

const GoogleButton = () => {
  const { t } = useTranslation('common');
  const { invitation } = useInvitation();

  const handleSignIn = () => {
    signIn('google', {
      callbackUrl: invitation ? `/invitations/${invitation}` : env.redirectIfAuthenticated,
    });
  };

  return (
    <button
      onClick={handleSignIn}
      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
    >
      <svg
        className="w-5 h-5 mr-2"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
        />
      </svg>
      {t('continue-with-google')}
    </button>
  );
};

export default GoogleButton;

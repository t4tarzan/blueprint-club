import Link from 'next/link';

const AgreeMessage = () => {
  return (
    <span className="text-sm text-gray-500">
      I agree to the{' '}
      <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
        Privacy Policy
      </Link>
    </span>
  );
};

export default AgreeMessage;

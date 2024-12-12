import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or is invalid.';
      case 'EmailSignin':
        return 'The e-mail could not be sent.';
      case 'EmailNotVerified':
        return 'Please verify your email address before signing in.';
      case 'default':
      default:
        return 'An error occurred during authentication.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-700">
              {error ? getErrorMessage(error as string) : 'An error occurred during authentication.'}
            </p>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-[#FFC107] hover:text-[#FFB300]"
            >
              Back to Sign In
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/auth/signup"
              className="text-sm font-medium text-[#FFC107] hover:text-[#FFB300]"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

interface AuthErrorProps {
  message?: string;
  code?: string;
}

const getErrorMessage = (code?: string): string => {
  switch (code) {
    case 'CredentialsSignin':
      return 'Invalid email or password';
    case 'EmailNotVerified':
      return 'Please verify your email before signing in';
    case 'EmailExists':
      return 'An account with this email already exists';
    case 'TokenExpired':
      return 'Verification link has expired. Please request a new one';
    case 'InvalidToken':
      return 'Invalid verification link';
    default:
      return 'An error occurred during authentication';
  }
};

export default function AuthError({ message, code }: AuthErrorProps) {
  const errorMessage = message || getErrorMessage(code);

  return (
    <div className="rounded-md bg-red-50 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
        </div>
      </div>
    </div>
  );
}

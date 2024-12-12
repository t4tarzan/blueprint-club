import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function VerifyEmail() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`/api/auth/verify?token=${token}`, {
        method: 'GET',
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          router.push('/social');
        }, 2000);
      } else {
        const data = await response.json();
        console.error('Verification failed:', data);
        setStatus('error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {status === 'verifying' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            <h2 className="text-2xl font-bold mb-4">Verifying your email...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC107] mx-auto"></div>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600"
          >
            <h2 className="text-2xl font-bold mb-4">Email verified successfully!</h2>
            <p>Redirecting you to the social platform...</p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600"
          >
            <h2 className="text-2xl font-bold mb-4">Verification failed</h2>
            <p>The verification link may have expired or is invalid.</p>
            <button
              onClick={() => router.push('/auth/signin')}
              className="mt-4 bg-[#FFC107] text-white px-4 py-2 rounded-md hover:bg-[#FFB300]"
            >
              Back to Sign In
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

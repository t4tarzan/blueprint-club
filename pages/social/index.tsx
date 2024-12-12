import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Social() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC107]"></div>
      </div>
    );
  }

  if (!session?.user?.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verification Required</h2>
          <p className="text-gray-600">
            Please verify your email address to access the social platform. Check your inbox for the verification link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="flex items-center space-x-4">
              <img
                src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`}
                alt={session.user.name || 'User'}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <p className="font-medium">{session.user.name}</p>
                <p className="text-sm text-gray-500">{session.user.email}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Create Post</h2>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#FFC107] focus:border-[#FFC107]"
                placeholder="What's on your mind?"
                rows={3}
              />
              <button className="mt-4 bg-[#FFC107] text-white px-4 py-2 rounded-md hover:bg-[#FFB300]">
                Post
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-center">No posts yet. Be the first to share something!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

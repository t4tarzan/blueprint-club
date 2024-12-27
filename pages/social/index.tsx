import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
  ChatBubbleLeftIcon,
  HeartIcon,
  ShareIcon,
  PhotoIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';

export default function Social() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [postContent, setPostContent] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated' && !isNavigating) {
      setIsNavigating(true);
      router.replace('/');
    }
  }, [status, router, isNavigating]);

  const handlePost = async () => {
    // TODO: Implement post creation
    console.log('Creating post:', postContent);
    setPostContent('');
  };

  if (status === 'loading' || isNavigating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'authenticated' && session?.user) {
    const posts = [
      {
        id: 1,
        author: 'Sarah Johnson',
        avatar: '/images/avatars/sarah.jpg',
        content: 'Just finished my first music production session at Blueprint Club! The studio equipment is amazing 🎵🎹',
        time: '2 hours ago',
        likes: 24,
        comments: 5,
        shares: 2,
      },
      {
        id: 2,
        author: 'Mike Chen',
        avatar: '/images/avatars/mike.jpg',
        content: 'Looking for collaborators on a new electronic music project. Anyone interested? #BPCCollaboration',
        time: '5 hours ago',
        likes: 18,
        comments: 8,
        shares: 3,
      },
      {
        id: 3,
        author: 'Emma Wilson',
        avatar: '/images/avatars/emma.jpg',
        content: 'Check out my latest track produced at the White Noise Academy! Link in comments 🎧',
        time: '1 day ago',
        likes: 45,
        comments: 12,
        shares: 7,
      },
    ];

    return (
      <DashboardLayout currentPath="/social">
        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Share Your Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="min-h-[100px] mb-4"
              />
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200">
                    <PhotoIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200">
                    <PaperClipIcon className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={handlePost}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors duration-200"
                >
                  Post
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{post.author}</h3>
                      <p className="text-sm text-gray-500">{post.time}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{post.content}</p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center justify-between w-full">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors duration-200">
                      <HeartIcon className="h-5 w-5" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors duration-200">
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors duration-200">
                      <ShareIcon className="h-5 w-5" />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return null;
}

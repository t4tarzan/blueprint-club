import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  ChartBarIcon,
  BookOpenIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' && !isNavigating) {
      setIsNavigating(true);
      router.replace('/auth/signin');
    }
  }, [status, router, isNavigating]);

  if (status === 'loading' || isNavigating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'authenticated' && session?.user) {
    const stats = [
      {
        title: 'Upcoming Classes',
        value: '3',
        description: 'Classes this week',
        icon: CalendarIcon,
        color: 'from-blue-500 to-blue-600',
      },
      {
        title: 'Progress',
        value: '75%',
        description: 'Course completion',
        icon: ChartBarIcon,
        color: 'from-purple-500 to-purple-600',
      },
      {
        title: 'Active Courses',
        value: '2',
        description: 'Currently enrolled',
        icon: BookOpenIcon,
        color: 'from-green-500 to-green-600',
      },
      {
        title: 'Community',
        value: '150+',
        description: 'Active members',
        icon: UserGroupIcon,
        color: 'from-yellow-500 to-yellow-600',
      },
    ];

    return (
      <DashboardLayout currentPath="/dashboard">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {session.user.name}!
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Here's what's happening with your courses today.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {item.title}
                    </CardTitle>
                    <div className={`bg-gradient-to-r ${item.color} rounded-full p-2`}>
                      <item.icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <div className="mt-4 bg-white shadow rounded-lg">
              <div className="p-6">
                <p className="text-gray-600">No recent activity to show.</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return null;
}

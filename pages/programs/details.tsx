import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChipIcon,
  ClockIcon,
  LightBulbIcon,
  ChatBubbleBottomCenterTextIcon,
  RocketLaunchIcon,
  CubeTransparentIcon,
} from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import ProgramDetailCard from '../../components/ProgramDetailCard';

const ProgramDetails = () => {
  const programs = [
    {
      variant: 'adults',
      title: 'Blueprint Club for Adults (BPC Adults)',
      subtitle: 'Foster expertise-driven innovation and micro-niche development',
      description: 'A comprehensive program designed for seasoned professionals and aspiring youth to build personal brands, develop expertise, and create sustainable knowledge-based products while fostering cross-generational collaboration.',
      features: [
        {
          title: 'Micro-Niche Development',
          description: 'Identify and grow expertise in specific domains through community-driven strategies and personalized learning paths.',
          icon: LightBulbIcon,
        },
        {
          title: 'Collaborative Community',
          description: 'Build partnerships between professionals and youth, enabling knowledge sharing and mutual growth opportunities.',
          icon: UserGroupIcon,
        },
        {
          title: 'AI-Enhanced Learning',
          description: 'Leverage cutting-edge AI tools for automated onboarding, content creation, and personalized growth recommendations.',
          icon: ChipIcon,
        },
        {
          title: 'Structured Growth',
          description: 'Follow a six-phase program designed to systematically build your expertise and market presence.',
          icon: RocketLaunchIcon,
        },
      ],
      phases: [
        {
          title: 'Planning and Research',
          description: 'Identify micro-niches and establish communication channels for maximum impact.',
        },
        {
          title: 'Community Engagement',
          description: 'Build tailored engagement strategies through webinars and live sessions.',
        },
        {
          title: 'Domain Expertise Development',
          description: 'Access resources for content creation, social media growth, and professional certifications.',
        },
        {
          title: 'Micro-Niche Growth',
          description: 'Expand reach through targeted marketing campaigns and data-driven analytics.',
        },
        {
          title: 'AI Integration',
          description: 'Implement automated processes and AI dashboards for optimization.',
        },
        {
          title: 'Feedback and Evolution',
          description: 'Regular updates based on community feedback and engagement metrics.',
        },
      ],
      benefits: [
        'Build and monetize your personal brand',
        'Access high-value tools and platforms',
        'Network with industry experts',
        'Create sustainable knowledge products',
        'Mentor the next generation',
        'Contribute to the knowledge economy',
      ],
    },
    {
      variant: 'schooling',
      title: 'Blueprint Club Schooling (BPC Schooling)',
      subtitle: 'Transform traditional education with technology and creativity',
      description: 'An innovative schooling program that combines traditional academics with modern technology and creative disciplines, preparing students for comprehensive success in the digital age.',
      features: [
        {
          title: 'Integrated Curriculum',
          description: 'Blend NCERT, IB, and Cambridge standards with modern skills development.',
          icon: AcademicCapIcon,
        },
        {
          title: 'Real-World Labs',
          description: 'Access specialized labs for hands-on learning in sciences, robotics, and digital media.',
          icon: CubeTransparentIcon,
        },
        {
          title: 'Holistic Development',
          description: 'Combine academics with arts, technology, and leadership training.',
          icon: ChatBubbleBottomCenterTextIcon,
        },
        {
          title: 'Personalized Learning',
          description: 'Receive individualized mentorship and goal-setting guidance.',
          icon: UserGroupIcon,
        },
      ],
      phases: [
        {
          title: 'Solar Spark',
          description: 'Foundation in goal-setting and time management skills.',
        },
        {
          title: 'Mercurial Mastery',
          description: 'Balance academic growth with interdisciplinary learning.',
        },
        {
          title: 'Venusian Harmony',
          description: 'Blend creativity with scientific thinking through coding and arts.',
        },
        {
          title: 'Global Groundbreakers',
          description: 'Tackle real-world problems with industry mentors.',
        },
        {
          title: 'Martian Innovators',
          description: 'Advanced projects in robotics, IoT, and AI.',
        },
        {
          title: 'Neptunian Creators',
          description: 'Master digital branding and multimedia storytelling.',
        },
      ],
      benefits: [
        'Globally recognized curriculum',
        'Hands-on technology experience',
        'Creative arts integration',
        'Leadership development',
        'Industry certifications',
        'Digital portfolio building',
      ],
      schedule: {
        title: 'Daily Schedule',
        times: [
          'Morning: Core Academic Learning',
          'Afternoon: Practical Lab Sessions',
          'Evening: Creative Projects',
        ],
      },
    },
    {
      variant: 'afterschool',
      title: 'Blueprint Club Afterschool (BPCAS)',
      subtitle: 'Enhance your skills beyond regular schooling',
      description: 'A flexible, modular learning program that complements regular schooling with hands-on experience, certifications, and skill development in technology, creative arts, and sciences.',
      features: [
        {
          title: 'Modular Learning',
          description: 'Choose from 16 specialized divisions based on your interests and goals.',
          icon: CubeTransparentIcon,
        },
        {
          title: 'Specialized Labs',
          description: 'Access five state-of-the-art labs for hands-on learning and projects.',
          icon: LightBulbIcon,
        },
        {
          title: 'Flexible Schedule',
          description: 'Convenient after-school hours with weekend project time.',
          icon: ClockIcon,
        },
        {
          title: 'Professional Certifications',
          description: 'Earn industry-recognized certifications while building your portfolio.',
          icon: AcademicCapIcon,
        },
      ],
      benefits: [
        'Industry certifications',
        'Hands-on project experience',
        'Flexible learning schedule',
        'Professional portfolio building',
        'Access to specialized labs',
        'Real-world skill development',
      ],
      schedule: {
        title: 'Program Schedule',
        times: [
          'Weekdays: 4:30 PM – 7:30 PM',
          'Weekends: 2-hour project sessions',
          'Additional divisions available',
        ],
      },
      certifications: [
        'Google',
        'Microsoft',
        'Cisco',
        'Adobe',
        'AWS',
        'IBM',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Programs</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of educational programs designed to empower learners at every stage of their journey.
          </p>
        </motion.div>

        <div className="space-y-16">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <ProgramDetailCard {...program} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;

import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ComputerDesktopIcon,
  ClockIcon,
  LightBulbIcon,
  ChatBubbleLeftIcon,
  RocketLaunchIcon,
  CubeIcon,
  CommandLineIcon,
  BeakerIcon,
  WrenchIcon
} from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import ProgramDetailCard from '../../components/ProgramDetailCard';

interface Program {
  variant: 'adults' | 'schooling' | 'afterschool' | 'music';
  title: string;
  subtitle: string;
  description: string;
  features: Array<{
    title: string;
    description: string;
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  }>;
  phases?: Array<{
    title: string;
    description: string;
  }>;
  benefits: string[];
  schedule?: {
    title: string;
    times: string[];
  };
  youtubeVideoId?: string;
}

const programs: Program[] = [
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
        icon: ComputerDesktopIcon,
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
        title: 'Content Development',
        description: 'Create high-quality content and establish your expertise.',
      },
      {
        title: 'Community Building',
        description: 'Build and engage with your target audience.',
      },
      {
        title: 'Product Development',
        description: 'Create and launch your knowledge-based products.',
      },
    ],
    benefits: [
      'Personal Brand Development',
      'Industry Recognition',
      'Monetization Opportunities',
      'Professional Network',
      'Continuous Learning',
    ],
    schedule: {
      title: 'Flexible Schedule',
      times: [
        'Weekday Evening Sessions: 6:00 PM - 9:00 PM',
        'Weekend Workshops: 10:00 AM - 4:00 PM',
        'Online Learning: 24/7 Access',
      ],
    },
  },
  {
    variant: 'afterschool',
    title: 'Blueprint Club After School (BPCAS)',
    subtitle: 'Enhance your skills beyond regular schooling',
    description: 'A flexible, modular learning program that complements regular schooling with hands-on experience, certifications, and skill development in technology, creative arts, and sciences.',
    features: [
      {
        title: 'Modular Learning',
        description: 'Choose from 16 specialized divisions based on your interests and goals.',
        icon: CubeIcon,
      },
      {
        title: 'Specialized Labs',
        description: 'Access state-of-the-art facilities for hands-on learning.',
        icon: BeakerIcon,
      },
      {
        title: 'Expert Mentorship',
        description: 'Learn from industry professionals and certified instructors.',
        icon: UserGroupIcon,
      },
      {
        title: 'Technical Skills',
        description: 'Learn practical technical skills with hands-on projects.',
        icon: WrenchIcon,
      },
    ],
    phases: [
      {
        title: 'Module Selection',
        description: 'Choose your learning path from available options.',
      },
      {
        title: 'Skill Building',
        description: 'Develop core competencies in chosen areas.',
      },
      {
        title: 'Project Work',
        description: 'Apply skills in practical projects.',
      },
      {
        title: 'Certification',
        description: 'Complete assessments and earn certifications.',
      },
    ],
    benefits: [
      'Flexible Schedule',
      'Practical Experience',
      'Industry Certifications',
      'Portfolio Development',
      'Career Guidance',
    ],
    schedule: {
      title: 'After-School Timings',
      times: [
        'Weekday Sessions: 4:00 PM - 7:00 PM',
        'Weekend Workshops: 10:00 AM - 4:00 PM',
        'Holiday Programs Available',
      ],
    },
  },
];

const ProgramDetails: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {programs.map((program, index) => (
            <ProgramDetailCard
              key={program.title}
              {...program}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ProgramDetails;

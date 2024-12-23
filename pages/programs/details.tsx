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
import StagesSlideshow from '../../components/StagesSlideshow';

interface Program {
  id: string;
  variant: 'adults' | 'schooling' | 'afterschool' | 'academy';
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
    image?: string;
  }>;
  benefits: string[];
  schedule?: {
    days: string[];
    times: string[];
  };
  certifications?: string[];
  youtubeVideoId?: string;
  showSlideshow?: boolean;
  overviewImage?: string;
  image?: string;
  imageAlt?: string;
  price?: string;
  duration?: string;
}

interface ProgramDetailCardProps {
  variant: 'adults' | 'schooling' | 'afterschool' | 'academy';
  title: string;
  subtitle: string;
  description: string;
  features: {
    title: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }[];
  schedule?: {
    days: string[];
    times: string[];
  };
  benefits: string[];
  image?: string;
  imageAlt?: string;
  price?: string;
  duration?: string;
}

const programs: Program[] = [
  {
    id: '1',
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
      days: ['Weekdays', 'Weekends'],
      times: [
        'Weekday Evening Sessions: 6:00 PM - 9:00 PM',
        'Weekend Workshops: 10:00 AM - 4:00 PM',
        'Online Learning: 24/7 Access',
      ],
    },
  },
  {
    id: '2',
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
        icon: BeakerIcon,
      },
      {
        title: 'Holistic Development',
        description: 'Combine academics with arts, technology, and leadership training.',
        icon: UserGroupIcon,
      },
      {
        title: 'AI-Enhanced Learning',
        description: 'Leverage cutting-edge AI tools for personalized learning paths.',
        icon: ComputerDesktopIcon,
      },
    ],
    phases: [
      {
        title: 'Solar Spark (Foundation)',
        description: 'Build strong foundations in goal-setting, time management, and basic digital literacy.',
        image: '/BPC Schooling Overview Images/Solar Spark.png',
      },
      {
        title: 'Mercurial Mastery (Academic Excellence)',
        description: 'Master core academic subjects while exploring interdisciplinary connections.',
        image: '/BPC Schooling Overview Images/Mercurial Mastery.png',
      },
      {
        title: 'Venusian Harmony (Creative Arts)',
        description: 'Blend creativity with technology through digital arts and multimedia projects.',
        image: '/BPC Schooling Overview Images/Venusian Harmony.png',
      },
      {
        title: 'Global Groundbreakers',
        description: 'Tackle real-world problems with industry mentors and develop innovative solutions.',
        image: '/BPC Schooling Overview Images/Global Groundbreakers.png',
      },
      {
        title: 'Martian Innovation',
        description: 'Explore advanced technology and engineering through hands-on projects.',
        image: '/BPC Schooling Overview Images/Martian Innovation.png',
      },
      {
        title: "Jupiter's Guides",
        description: 'Develop leadership skills and mentor younger students in their journey.',
        image: "/BPC Schooling Overview Images/Jupiter's Guides.png",
      },
      {
        title: 'Saturnine Scholars',
        description: 'Master complex academic concepts and prepare for higher education.',
        image: '/BPC Schooling Overview Images/Saturnine Scholars.png',
      },
      {
        title: 'Uranian Visionaries',
        description: 'Explore cutting-edge technology and future career paths.',
        image: '/BPC Schooling Overview Images/Uranian Visionaries.png',
      },
      {
        title: 'Neptunian Creators',
        description: 'Create impactful projects that benefit the community and beyond.',
        image: '/BPC Schooling Overview Images/Neptunian Creators.png',
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
      days: ['Weekdays'],
      times: [
        'Morning: Core Academic Learning (8:00 AM - 12:00 PM)',
        'Afternoon: Practical Lab Sessions (1:00 PM - 3:00 PM)',
        'Evening: Creative Projects (3:30 PM - 5:00 PM)',
      ],
    },
    showSlideshow: true,
    overviewImage: '/BPC Schooling Overview Images/Overview BPC-Schooling.png',
  },
  {
    id: '3',
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
      days: ['Weekdays', 'Weekends'],
      times: [
        'Weekday Sessions: 4:00 PM - 7:00 PM',
        'Weekend Workshops: 10:00 AM - 4:00 PM',
        'Holiday Programs Available',
      ],
    },
  },
  {
    id: '4',
    variant: 'academy',
    title: 'Blueprint Club Academy (BCA)',
    subtitle: 'Transform your skills with our expert-led academy',
    description: 'A comprehensive program designed to transform your skills with expert-led training, hands-on experience, and industry-recognized certifications.',
    features: [
      {
        title: 'Expert-Led Training',
        description: 'Learn from industry experts with years of experience.',
        icon: UserGroupIcon,
      },
      {
        title: 'Hands-On Experience',
        description: 'Apply skills in practical projects and real-world scenarios.',
        icon: BeakerIcon,
      },
      {
        title: 'Industry Certifications',
        description: 'Earn industry-recognized certifications to boost your career.',
        icon: CommandLineIcon,
      },
      {
        title: 'Career Guidance',
        description: 'Get personalized career guidance and mentorship.',
        icon: ChatBubbleLeftIcon,
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
      'Expert-Led Training',
      'Hands-On Experience',
      'Industry Certifications',
      'Career Guidance',
      'Portfolio Development',
    ],
    schedule: {
      days: ['Weekdays', 'Weekends'],
      times: [
        'Weekday Sessions: 6:00 PM - 9:00 PM',
        'Weekend Workshops: 10:00 AM - 4:00 PM',
        'Online Learning: 24/7 Access',
      ],
    },
    image: '/BPC Academy Overview Images/Overview BPC-Academy.png',
    imageAlt: 'BPC Academy Overview Image',
    price: '₹ 20,000',
    duration: '6 months',
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
          {programs.map((program) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <ProgramDetailCard
                key={program.id}
                variant={program.variant}
                title={program.title}
                subtitle={program.subtitle}
                description={program.description}
                features={program.features}
                schedule={program.schedule}
                benefits={program.benefits}
                image="/images/program-placeholder.jpg"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ProgramDetails;

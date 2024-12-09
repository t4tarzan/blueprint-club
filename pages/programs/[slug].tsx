import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  UserGroupIcon,
  BeakerIcon,
  ClockIcon,
  LightBulbIcon,
  ChatBubbleLeftIcon,
  RocketLaunchIcon,
  CubeIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import ProgramDetailCard from '../../components/ProgramDetailCard';

type ProgramVariant = 'adults' | 'schooling' | 'afterschool' | 'music';

interface Program {
  variant: ProgramVariant;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  features: Array<{
    title: string;
    description: string;
    icon: any;
  }>;
  phases?: Array<{
    title: string;
    description: string;
    image?: string;
  }>;
  benefits: string[];
  schedule?: {
    title: string;
    times: string[];
  };
  youtubeVideoId?: string;
  overviewImage?: string;
}

const programData: Record<string, Program> = {
  'bpc-adults': {
    variant: 'adults',
    title: 'Blueprint Club for Adults (BPC Adults)',
    subtitle: 'Foster expertise-driven innovation and micro-niche development',
    description: 'A comprehensive program designed for seasoned professionals and aspiring youth to build personal brands, develop expertise, and create sustainable knowledge-based products while fostering cross-generational collaboration.',
    heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80',
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
        icon: BeakerIcon,
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
      'Continuous Learning'
    ],
    schedule: {
      title: 'Flexible Schedule',
      times: [
        'Weekday Evening Sessions: 6:00 PM - 9:00 PM',
        'Weekend Workshops: 10:00 AM - 4:00 PM',
        'Online Learning: 24/7 Access'
      ]
    }
  },
  'bpc-schooling': {
    variant: 'schooling',
    title: 'Blueprint Club Schooling (BPC Schooling)',
    subtitle: 'Transform traditional education with technology and creativity',
    description: 'An innovative schooling program that combines traditional academics with modern technology and creative disciplines, preparing students for comprehensive success in the digital age.',
    heroImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2932&q=80',
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
        icon: CommandLineIcon,
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
      title: 'Daily Schedule',
      times: [
        'Morning: Core Academic Learning (8:00 AM - 12:00 PM)',
        'Afternoon: Practical Lab Sessions (1:00 PM - 3:00 PM)',
        'Evening: Creative Projects (3:30 PM - 5:00 PM)',
      ],
    },
    overviewImage: '/BPC Schooling Overview Images/Overview BPC-Schooling.png',
  },
  'bpcas': {
    variant: 'afterschool',
    title: 'Blueprint Club Afterschool (BPCAS)',
    subtitle: 'Enhance your skills beyond regular schooling',
    description: 'A flexible, modular learning program that complements regular schooling with hands-on experience, certifications, and skill development in technology, creative arts, and sciences.',
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2940&q=80',
    features: [
      {
        title: 'Flexible Learning',
        description: 'Choose from various modules based on your interests.',
        icon: ClockIcon,
      },
      {
        title: 'Hands-on Experience',
        description: 'Learn through practical projects and real applications.',
        icon: BeakerIcon,
      },
      {
        title: 'Expert Guidance',
        description: 'Learn from industry professionals and experienced mentors.',
        icon: ChatBubbleLeftIcon,
      },
      {
        title: 'Skill Certification',
        description: 'Earn recognized certifications in your chosen fields.',
        icon: AcademicCapIcon,
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
      'Career Guidance'
    ],
    schedule: {
      title: 'After-School Timings',
      times: [
        'Weekday Sessions: 4:00 PM - 7:00 PM',
        'Weekend Workshops: 10:00 AM - 4:00 PM',
        'Holiday Programs Available'
      ]
    }
  },
  'rsl-program': {
    variant: 'music',
    title: 'White Noise Academy RSL Club',
    subtitle: 'Nurturing the next generation of musicians and digital creators',
    description: 'A comprehensive program offering graded music exams, live performances, and vocational qualifications that prepare students for professional careers in music, media, and creative industries.',
    youtubeVideoId: 'srVthlBpdnc',
    heroImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    features: [
      {
        title: 'Graded Music Exams',
        description: 'RSL London certification in various instruments and vocals, from beginner to advanced levels.',
        icon: AcademicCapIcon,
      },
      {
        title: 'Live Performance',
        description: 'Regular opportunities for gigs, recitals, and symphonies to boost stage confidence.',
        icon: UserGroupIcon,
      },
      {
        title: 'Digital Portfolio',
        description: 'Build professional artist profiles with websites and social media presence.',
        icon: CommandLineIcon,
      },
      {
        title: 'Vocational Training',
        description: 'RSL London-certified diplomas in digital marketing, animation, and content creation.',
        icon: AcademicCapIcon,
      },
    ],
    phases: [
      {
        title: 'Music Theory',
        description: 'Sheet music analysis and theoretical foundations.',
        image: '/RSL Program Images/Music Theory.png',
      },
      {
        title: 'Instrument Mastery',
        description: 'Specialized training in chosen instruments.',
        image: '/RSL Program Images/Instrument Mastery.png',
      },
      {
        title: 'Studio Production',
        description: 'Professional recording and music production.',
        image: '/RSL Program Images/Studio Production.png',
      },
      {
        title: 'Digital Arts',
        description: 'Animation, podcasting, and social media content.',
        image: '/RSL Program Images/Digital Arts.png',
      },
      {
        title: 'Live Performance',
        description: 'Stage presence and collaborative performances.',
        image: '/RSL Program Images/Live Performance.png',
      }
    ],
    benefits: [
      'RSL London Certified Qualifications',
      'Professional Studio Recording Experience',
      'Digital Portfolio Development',
      'University Pathway Opportunities',
      'Industry Network Building',
      'Regular Performance Platforms'
    ],
    schedule: {
      title: 'Weekend Sessions',
      times: [
        'Morning: 10:00 AM – 1:00 PM (Theory & Analysis)',
        'Evening: 4:00 PM – 7:00 PM (Practice & Performance)',
        'Flexible Studio Hours for Recording'
      ],
    },
  }
};

export default function ProgramPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  if (!slug || typeof slug !== 'string' || !programData[slug]) {
    return <div>Loading...</div>;
  }

  const program = programData[slug] as Program;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Hero
        title={program.title}
        subtitle={program.subtitle}
        backgroundImage={program.heroImage}
      />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProgramDetailCard
            variant={program.variant}
            title={program.title}
            subtitle={program.subtitle}
            description={program.description}
            features={program.features}
            phases={program.phases}
            benefits={program.benefits}
            schedule={program.schedule}
            showSlideshow={program.variant === 'schooling'}
            overviewImage={program.overviewImage}
            youtubeVideoId={program.youtubeVideoId}
          />
        </motion.div>
      </div>
    </div>
  );
}

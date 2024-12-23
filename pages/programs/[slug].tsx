import { useRouter } from 'next/router';
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
import ProgramDetailCard from '../../components/ProgramDetailCard';
import YouTubeEmbed from '../../components/YouTubeEmbed';
import ImageGrid from '../../components/ImageGrid';

type ProgramVariant = 'adults' | 'schooling' | 'afterschool' | 'academy';

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
    days: string[];
    times: string[];
  };
  youtubeVideoId?: string;
  overviewImage?: string;
  certifications?: string[];
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
      days: ['Weekdays', 'Weekends'],
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
    subtitle: 'Transformative education integrating traditional learning with modern technology',
    description: 'A comprehensive schooling program that combines traditional education with cutting-edge technology and creative disciplines. Our curriculum aligns with NCERT, IB, and Cambridge standards, featuring nine unique stages of development to prepare students for academic, personal, and professional success.',
    heroImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2932&q=80',
    youtubeVideoId: 'oJuYhqUkNP4',
    features: [
      {
        title: 'Integrated Curriculum',
        description: 'Comprehensive academic growth aligned with NCERT, IB, and Cambridge standards, featuring our unique 9-stage learning system.',
        icon: AcademicCapIcon,
      },
      {
        title: 'Real-World Labs',
        description: 'Specialized labs for physics, chemistry, biology, robotics, IoT, and AI, providing hands-on experience with real-world technology.',
        icon: BeakerIcon,
      },
      {
        title: 'Holistic Development',
        description: 'Integration of music, art, and digital media to foster creativity alongside traditional academics.',
        icon: LightBulbIcon,
      },
      {
        title: 'Personalized Learning',
        description: 'Individual goal-setting and mentorship to help students achieve their unique career aspirations.',
        icon: UserGroupIcon,
      },
    ],
    phases: [
      {
        title: 'Solar Spark',
        description: 'Foundation phase focusing on goal-setting and time management skills. Students learn to organize their academic life and develop essential study habits.',
        image: '/BPC Schooling Overview Images/Solar Spark.png'
      },
      {
        title: 'Mercurial Mastery',
        description: 'Students develop academic balance and interdisciplinary thinking, connecting concepts across subjects for deeper understanding.',
        image: '/BPC Schooling Overview Images/Mercurial Mastery.png'
      },
      {
        title: 'Venusian Harmony',
        description: 'Integration of creativity and scientific thinking through coding, programmable chemistry experiments, and artistic expression.',
        image: '/BPC Schooling Overview Images/Venusian Harmony.png'
      },
      {
        title: 'Global Groundbreakers',
        description: 'Students engage in real-world problem-solving with guidance from IT professionals and industry mentors.',
        image: '/BPC Schooling Overview Images/Global Groundbreakers.png'
      },
      {
        title: 'Martian Innovation',
        description: 'Advanced phase focusing on robotics, IoT, and AI projects, preparing students for future technology careers.',
        image: '/BPC Schooling Overview Images/Martian Innovation.png'
      },
      {
        title: "Jupiter's Guides",
        description: 'Career exploration through industry mentorship and practical exposure to various professional fields.',
        image: "/BPC Schooling Overview Images/Jupiter's Guides.png"
      },
      {
        title: 'Saturnine Scholars',
        description: 'Academic excellence through curriculum-mapped assessments and challenging projects that test comprehensive understanding.',
        image: '/BPC Schooling Overview Images/Saturnine Scholars.png'
      },
      {
        title: 'Uranian Visionaries',
        description: 'Development of leadership and entrepreneurship skills through specialized niche projects and initiatives.',
        image: '/BPC Schooling Overview Images/Uranian Visionaries.png'
      },
      {
        title: 'Neptunian Creators',
        description: 'Mastering digital branding and storytelling through blogs, videos, and podcasts, preparing for modern communication.',
        image: '/BPC Schooling Overview Images/Neptunian Creators.png'
      }
    ],
    benefits: [
      'Globally recognized educational standards and certifications',
      'Hands-on experience in specialized labs and real-world projects',
      'Integration of creative and technical disciplines',
      'Personalized mentorship and career guidance',
      'Digital and physical portfolio development',
      'Leadership and entrepreneurship skills',
      'Confidence building through practical projects',
      'Balanced focus on academics and modern skills'
    ],
    schedule: {
      days: ['Weekdays', 'Weekends'],
      times: [
        'Morning Sessions: Core academic learning',
        'Afternoon Labs: Practical, project-based sessions',
        'Regular assessments combining traditional tests with real-world evaluations',
        'Portfolio building sessions throughout the program'
      ]
    },
    overviewImage: '/BPC Schooling Overview Images/Overview BPC-Schooling.png'
  },
  'bpcas': {
    variant: 'afterschool',
    title: 'Blueprint Club Afterschool Program (BPCAS)',
    subtitle: 'Modular skill-based learning for high school students',
    description: 'A comprehensive afterschool program providing high school students with modular, skill-based learning experiences. Our program combines hands-on workshops, cutting-edge labs, and globally recognized certifications to help students excel in their chosen fields.',
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2940&q=80',
    features: [
      {
        title: 'Modular Learning System',
        description: 'Choose from specialized modules including Tech, Creative, and Science tracks, each consisting of three divisions completed in one year.',
        icon: CubeIcon,
      },
      {
        title: 'Specialized Labs',
        description: 'Access to five state-of-the-art labs: IoT & Robotics, Creative Media, Biology & Chemistry, Physics, and AI & Networking.',
        icon: BeakerIcon,
      },
      {
        title: 'Flexible Schedule',
        description: 'Convenient after-school hours with weekday sessions from 4:30 PM to 7:30 PM and weekend project time.',
        icon: ClockIcon,
      },
      {
        title: 'Certifications',
        description: 'Earn industry-recognized certifications from Google, Microsoft, Cisco, and Adobe while building a professional portfolio.',
        icon: AcademicCapIcon,
      },
    ],
    phases: [
      {
        title: 'IoT and Embedded Systems',
        description: 'Learn to design and build Internet of Things devices and embedded systems.',
      },
      {
        title: 'Data Science and Analytics',
        description: 'Master data analysis, visualization, and machine learning fundamentals.',
      },
      {
        title: 'Content Creation',
        description: 'Develop skills in digital storytelling, video production, and content marketing.',
      },
      {
        title: 'Robotics and Automation',
        description: 'Build and program robots while learning automation principles.',
      },
      {
        title: 'Art and Design',
        description: 'Express creativity through digital art, graphic design, and UI/UX.',
      },
      {
        title: 'Green Technology',
        description: 'Explore sustainable technologies and environmental solutions.',
      },
      {
        title: 'Programming Foundations',
        description: 'Learn core programming concepts and popular languages.',
      },
      {
        title: 'Networking',
        description: 'Understand computer networks and cybersecurity principles.',
      },
      {
        title: 'Digital Marketing',
        description: 'Master social media, SEO, and digital marketing strategies.',
      },
      {
        title: 'Leadership',
        description: 'Develop communication and leadership skills for success.',
      },
      {
        title: 'Health and Wellness',
        description: 'Explore health sciences and culinary arts.',
      },
      {
        title: 'Electronics',
        description: 'Learn electronic circuit design and hardware development.',
      },
      {
        title: 'AI Technologies',
        description: 'Explore artificial intelligence and machine learning applications.',
      },
      {
        title: 'Space Exploration',
        description: 'Study astronomy and space science fundamentals.',
      },
      {
        title: 'Science and Forensics',
        description: 'Learn scientific investigation and forensic techniques.',
      },
      {
        title: 'Creative Expression',
        description: 'Explore humanities and various forms of creative expression.',
      }
    ],
    benefits: [
      'Hands-on experience in high-demand fields',
      'Global certifications from industry leaders',
      'Real-world project portfolio',
      'Cross-disciplinary skill development',
      'Access to state-of-the-art labs',
      'Flexible learning schedule',
      'Professional mentorship',
      'Industry-relevant training'
    ],
    schedule: {
      days: ['Weekdays', 'Weekends'],
      times: [
        'Weekday Division 1: 4:30 PM – 6:30 PM',
        'Weekday Division 2: 6:30 PM – 7:30 PM',
        'Weekend Project Time: Flexible 2-hour slots',
        'Duration: One year per module (3 divisions)',
        'Additional divisions available at ₹16,000/month'
      ]
    }
  },
  'rsl-program': {
    variant: 'music' as ProgramVariant,
    title: 'RSL Awards Music Program',
    subtitle: 'Globally recognized music education and certification',
    description: 'An internationally acclaimed music education program offering comprehensive training in various instruments and music theory. Our program follows the prestigious RSL Awards curriculum, providing students with globally recognized certifications.',
    youtubeVideoId: 'srVthlBpdnc',
    heroImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=2940&q=80',
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
      days: ['Weekends'],
      times: [
        'Morning: 10:00 AM – 1:00 PM (Theory & Analysis)',
        'Evening: 4:00 PM – 7:00 PM (Practice & Performance)',
        'Flexible Studio Hours for Recording'
      ],
    },
  }
};

const getProgramBySlug = (slug: string): Program | undefined => {
  return programData[slug];
};

const ProgramPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const program = getProgramBySlug(slug as string);

  if (!program) {
    return <div>Program not found</div>;
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <ProgramDetailCard {...program} />
    </div>
  );
};

export default ProgramPage;

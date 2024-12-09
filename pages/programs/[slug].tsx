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

const programData = {
  'bpc-adults': {
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
    heroImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2940&auto=format&fit=crop',
  },
  'bpc-schooling': {
    variant: 'schooling',
    title: 'BPC Schooling Club',
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
        icon: CubeIcon,
      },
      {
        title: 'Holistic Development',
        description: 'Combine academics with arts, technology, and leadership training.',
        icon: ChatBubbleLeftIcon,
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
        description: 'Goal-setting and time management.',
        image: '/BPC Schooling Overview Images/Solar Spark.png',
      },
      {
        title: 'Mercurial Mastery',
        description: 'Academic balance and interdisciplinary growth.',
        image: '/BPC Schooling Overview Images/Mercurial Mastery.png',
      },
      {
        title: 'Venusian Harmony',
        description: 'Creativity and scientific thinking through coding, programmable chemistry, and art.',
        image: '/BPC Schooling Overview Images/Venusian Harmony.png',
      },
      {
        title: 'Global Groundbreakers',
        description: 'Real-world problem-solving with IT and industry mentors.',
        image: '/BPC Schooling Overview Images/Global Groundbreakers.png',
      },
      {
        title: 'Martian Innovators',
        description: 'Advanced robotics, IoT, and AI projects.',
        image: '/BPC Schooling Overview Images/Martian Innovation.png',
      },
      {
        title: "Jupiter's Guides",
        description: 'Career clarity through industry mentorship and practical exposure.',
        image: "/BPC Schooling Overview Images/Jupiter's Guides.png",
      },
      {
        title: 'Saturnine Scholars',
        description: 'Academic strengthening with curriculum-mapped assessments and projects.',
        image: '/BPC Schooling Overview Images/Saturnine Scholars.png',
      },
      {
        title: 'Uranian Visionaries',
        description: 'Leadership and entrepreneurship through niche projects.',
        image: '/BPC Schooling Overview Images/Uranian Visionaries.png',
      },
      {
        title: 'Neptunian Creators',
        description: 'Mastery of digital branding and storytelling in blogs, videos, and podcasts.',
        image: '/BPC Schooling Overview Images/Neptunian Creators.png',
      }
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
    heroImage: 'https://images.unsplash.com/photo-1632571401005-458e9d244591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    overviewImage: '/BPC Schooling Overview Images/Overview BPC-Schooling.png'
  },
  'bpcas': {
    variant: 'afterschool',
    title: 'Blueprint Club Afterschool (BPCAS)',
    subtitle: 'Enhance your skills beyond regular schooling',
    description: 'A flexible, modular learning program that complements regular schooling with hands-on experience, certifications, and skill development in technology, creative arts, and sciences.',
    features: [
      {
        title: 'Hands-on Learning',
        description: 'Engage in practical projects and real-world applications.',
        icon: BeakerIcon,
      },
      {
        title: 'Flexible Schedule',
        description: 'Choose modules and timings that fit your academic calendar.',
        icon: ClockIcon,
      },
      {
        title: 'Expert Mentorship',
        description: 'Learn from industry professionals and certified instructors.',
        icon: UserGroupIcon,
      },
      {
        title: 'Certification Path',
        description: 'Earn recognized certifications from leading companies.',
        icon: AcademicCapIcon,
      },
    ],
    phases: [
      {
        title: 'Technology Track',
        description: 'AI, robotics, and programming fundamentals.',
        image: '/images/tech-track.png',
      },
      {
        title: 'Creative Arts',
        description: 'Digital design, animation, and multimedia.',
        image: '/images/creative-arts.png',
      },
      {
        title: 'Professional Skills',
        description: 'Communication, leadership, and project management.',
        image: '/images/prof-skills.png',
      },
    ],
    benefits: [
      'Industry-recognized certifications',
      'Hands-on project experience',
      'Professional portfolio development',
      'Flexible learning schedule',
      'Expert mentorship',
      'Career guidance',
    ],
    schedule: {
      title: 'Program Schedule',
      times: [
        'Weekday Evening Sessions',
        'Weekend Workshops',
        'Self-Paced Learning',
      ],
    },
    certifications: [
      'Adobe',
      'AWS',
      'IBM',
    ],
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2940&auto=format&fit=crop'
  },
  'rsl-program': {
    variant: 'music',
    title: 'White Noise Academy RSL Club',
    subtitle: 'Nurturing the next generation of musicians and digital creators',
    description: 'A comprehensive program offering graded music exams, live performances, and vocational qualifications that prepare students for professional careers in music, media, and creative industries.',
    youtubeVideoId: 'srVthlBpdnc',
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
    heroImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80'
  }
};

export default function ProgramPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  if (!slug || typeof slug !== 'string' || !programData[slug as keyof typeof programData]) {
    return <div>Loading...</div>;
  }

  const program = programData[slug as keyof typeof programData];

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

import { motion } from 'framer-motion';
import { HeroSection } from '@/components/sections/HeroSection';
import ProgramDetailCard from '@/components/ProgramDetailCard';
import {
  AcademicCapIcon,
  UserGroupIcon,
  BeakerIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const programData = {
  variant: 'schooling' as const,
  title: 'Blueprint Club Schooling (BPC Schooling)',
  subtitle: 'Transformative education integrating traditional learning with modern technology',
  description: 'A comprehensive schooling program that combines traditional education with cutting-edge technology and creative disciplines. Our curriculum aligns with NCERT, IB, and Cambridge standards, featuring nine unique stages of development to prepare students for academic, personal, and professional success.',
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
      image: '/images/programs/bpc-schooling/phases/solar-spark.png'
    },
    {
      title: 'Mercurial Mastery',
      description: 'Students develop academic balance and interdisciplinary thinking, connecting concepts across subjects for deeper understanding.',
      image: '/images/programs/bpc-schooling/phases/mercurial-mastery.png'
    },
    {
      title: 'Venusian Harmony',
      description: 'Integration of creativity and scientific thinking through coding, programmable chemistry experiments, and artistic expression.',
      image: '/images/programs/bpc-schooling/phases/venusian-harmony.png'
    },
    {
      title: 'Global Groundbreakers',
      description: 'Students engage in real-world problem-solving with guidance from IT professionals and industry mentors.',
      image: '/images/programs/bpc-schooling/phases/global-groundbreakers.png'
    },
    {
      title: 'Martian Innovation',
      description: 'Advanced phase focusing on robotics, IoT, and AI projects, preparing students for future technology careers.',
      image: '/images/programs/bpc-schooling/phases/martian-innovation.png'
    },
    {
      title: "Jupiter's Guides",
      description: 'Career exploration through industry mentorship and practical exposure to various professional fields.',
      image: '/images/programs/bpc-schooling/phases/jupiters-guides.png'
    },
    {
      title: 'Saturnine Scholars',
      description: 'Academic excellence through curriculum-mapped assessments and challenging projects that test comprehensive understanding.',
      image: '/images/programs/bpc-schooling/phases/saturnine-scholars.png'
    },
    {
      title: 'Uranian Visionaries',
      description: 'Development of leadership and entrepreneurship skills through specialized niche projects and initiatives.',
      image: '/images/programs/bpc-schooling/phases/uranian-visionaries.png'
    },
    {
      title: 'Neptunian Creators',
      description: 'Mastering digital branding and storytelling through blogs, videos, and podcasts, preparing for modern communication.',
      image: '/images/programs/bpc-schooling/phases/neptunian-creators.png'
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
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    times: [
      'Morning Sessions: Core academic learning',
      'Afternoon Labs: Practical, project-based sessions',
      'Evening Activities: Creative and physical development'
    ]
  },
  youtubeVideoId: 'oJuYhqUkNP4',
  overviewImage: '/images/programs/bpc-schooling/overview.jpg',
  stages: [
    {
      title: 'Overview BPC-Schooling',
      imagePath: '/BPC Schooling Overview Images/Overview BPC-Schooling.png'
    },
    {
      title: 'Global Groundbreakers',
      imagePath: '/BPC Schooling Overview Images/Global Groundbreakers.png'
    },
    {
      title: 'Jupiter\'s Guides',
      imagePath: '/BPC Schooling Overview Images/Jupiter\'s Guides.png'
    },
    {
      title: 'Martian Innovation',
      imagePath: '/BPC Schooling Overview Images/Martian Innovation.png'
    },
    {
      title: 'Mercurial Mastery',
      imagePath: '/BPC Schooling Overview Images/Mercurial Mastery.png'
    },
    {
      title: 'Neptunian Creators',
      imagePath: '/BPC Schooling Overview Images/Neptunian Creators.png'
    },
    {
      title: 'Saturnine Scholars',
      imagePath: '/BPC Schooling Overview Images/Saturnine Scholars.png'
    },
    {
      title: 'Solar Spark',
      imagePath: '/BPC Schooling Overview Images/Solar Spark.png'
    },
    {
      title: 'Uranian Visionaries',
      imagePath: '/BPC Schooling Overview Images/Uranian Visionaries.png'
    },
    {
      title: 'Venusian Harmony',
      imagePath: '/BPC Schooling Overview Images/Venusian Harmony.png'
    }
  ]
};

export default function BPCSchoolingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        title="BPC Schooling"
        subtitle="Transform Education with Technology"
        description="A comprehensive schooling program that combines traditional education with cutting-edge technology and creative disciplines."
        imageSrc="/images/programs/bpc-schooling/hero.jpg"
        ctaText="Join the Program"
        ctaHref="#enroll"
      />

      {/* Overview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Comprehensive School Education</h2>
            <p className="text-slate-600 mb-12">
              BPC Schooling offers a holistic approach to education, combining academic excellence
              with personal development and practical skills.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-video"
            >
              <img
                src="/images/programs/bpc-schooling/overview.jpg"
                alt="BPC Schooling Overview"
                className="rounded-lg shadow-lg object-cover w-full h-full"
              />
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <motion.div variants={item}>
                <h3 className="text-2xl font-semibold mb-4">Program Highlights</h3>
                <ul className="space-y-4">
                  {[
                    "Personalized learning paths",
                    "Interactive classroom sessions",
                    "Regular progress assessments",
                    "Extracurricular activities",
                    "Parent-teacher collaboration"
                  ].map((point, index) => (
                    <motion.li
                      key={index}
                      variants={item}
                      className="flex items-start space-x-3"
                    >
                      <span className="text-[#FFC107]">•</span>
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <ProgramDetailCard {...programData} />
      </section>
    </div>
  );
}

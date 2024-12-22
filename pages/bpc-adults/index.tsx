import { motion } from 'framer-motion';
import { HeroSection } from '@/components/sections/HeroSection';
import ProgramDetailCard from '@/components/ProgramDetailCard';
import { 
  LightBulbIcon,
  UserGroupIcon,
  BeakerIcon,
  RocketLaunchIcon,
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

const phases = [
  {
    title: "Phase 1: Foundation",
    description: "Build core professional skills and identify your niche.",
    points: [
      "Personal brand development",
      "Professional communication skills",
      "Industry analysis and niche selection",
      "Digital presence establishment"
    ]
  },
  {
    title: "Phase 2: Expertise Development",
    description: "Deepen your knowledge and start building authority.",
    points: [
      "Specialized skill acquisition",
      "Content creation strategies",
      "Network building",
      "Portfolio development"
    ]
  },
  {
    title: "Phase 3: Innovation & Leadership",
    description: "Lead projects and innovate in your field.",
    points: [
      "Project leadership",
      "Innovation methodologies",
      "Team collaboration",
      "Industry contribution"
    ]
  }
];

const programData = {
  variant: 'adults' as const,
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
  phases: phases,
  benefits: [
    'Personal Brand Development',
    'Industry Recognition',
    'Monetization Opportunities',
    'Professional Network',
    'Continuous Learning'
  ],
  overviewImage: '/images/programs/bpc-adults/overview.jpg',
};

export default function BPCAdultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        title="BPC Adults"
        subtitle="Professional Development for Modern Careers"
        description="Foster a community of seasoned professionals through expertise-driven innovation and micro-niche development."
        imageSrc="/images/programs/bpc-adults/hero.jpg"
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
            <h2 className="text-3xl font-bold mb-6">Transform Your Professional Journey</h2>
            <p className="text-slate-600 mb-12">
              BPC Adults is designed for professionals seeking to elevate their careers through
              specialized expertise development and innovative approaches to professional growth.
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
                src="/images/programs/bpc-adults/overview.jpg"
                alt="BPC Adults Overview"
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
                <h3 className="text-2xl font-semibold mb-4">Why Choose BPC Adults?</h3>
                <ul className="space-y-4">
                  {[
                    "Expert-led mentorship and guidance",
                    "Flexible learning schedule",
                    "Real-world project experience",
                    "Industry-recognized certifications",
                    "Networking opportunities"
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

import { motion } from 'framer-motion';
import { HeroSection } from '@/components/sections/HeroSection';
import ProgramDetailCard from '@/components/ProgramDetailCard';
import {
  BeakerIcon,
  AcademicCapIcon,
  LightBulbIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

const programData = {
  variant: 'afterschool' as const,
  title: 'Blueprint Club After School (BPCAS)',
  subtitle: 'Empowering students through hands-on learning and innovation',
  description: 'A comprehensive after-school program designed to empower students through hands-on workshops, cutting-edge labs, and globally recognized certifications. Students explore diverse fields from technology to creative arts while building practical skills and confidence.',
  features: [
    {
      title: 'Hands-on Learning',
      description: 'Practical experience in specialized labs for robotics, IoT, AI, and creative arts.',
      icon: BeakerIcon,
    },
    {
      title: 'Global Certifications',
      description: 'Earn recognized certifications from industry leaders in technology and creative fields.',
      icon: AcademicCapIcon,
    },
    {
      title: 'Innovation Focus',
      description: 'Develop creative problem-solving skills through project-based learning.',
      icon: LightBulbIcon,
    },
    {
      title: 'Career Preparation',
      description: 'Build a strong foundation for future careers in technology and creative industries.',
      icon: RocketLaunchIcon,
    }
  ],
  phases: [
    {
      title: 'Foundation Skills',
      description: 'Master core concepts and basic tools in your chosen field.',
    },
    {
      title: 'Project Development',
      description: 'Apply skills to real-world projects with guidance from mentors.',
    },
    {
      title: 'Advanced Techniques',
      description: 'Learn specialized tools and advanced methodologies.',
    },
    {
      title: 'Portfolio Building',
      description: 'Create a professional portfolio showcasing your best work.',
    }
  ],
  benefits: [
    'Hands-on experience with cutting-edge technology',
    'Industry-recognized certifications',
    'Professional portfolio development',
    'Networking opportunities',
    'Career guidance and mentorship',
    'Access to specialized labs and equipment',
    'Real-world project experience',
    'Creative skill development'
  ],
  schedule: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    times: [
      '4:30 PM - 7:30 PM',
      'Flexible 2-hour slots',
      '24/7 Access'
    ]
  },
  certifications: [
    'Adobe Creative Suite',
    'Google Cloud',
    'Microsoft Technology Associate',
    'AWS Certified Developer',
    'Unity Game Developer'
  ],
  overviewImage: '/images/programs/bpcas/overview.jpg'
};

export default function BPCASPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        title="BPC After School"
        subtitle="Enriching After-School Learning"
        description="An innovative after-school program that combines academic support with creative and technical skill development."
        imageSrc="/images/programs/bpcas/hero.jpg"
        ctaText="Join the Program"
        ctaHref="#enroll"
      />

      <section className="py-20">
        <ProgramDetailCard {...programData} />
      </section>
    </div>
  );
}

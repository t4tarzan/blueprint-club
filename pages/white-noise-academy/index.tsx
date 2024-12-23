import { motion } from 'framer-motion';
import { HeroSection } from '@/components/sections/HeroSection';
import ProgramDetailCard from '@/components/ProgramDetailCard';
import { 
  Music, 
  Mic, 
  Radio,
  Headphones,
  Piano,
  Guitar,
  Speaker,
  Film
} from 'lucide-react';
import {
  BeakerIcon,
  AcademicCapIcon,
  LightBulbIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

const programData = {
  variant: 'academy' as const,
  title: 'White Noise Academy',
  subtitle: 'RSL Club for Music and Digital Arts',
  description: 'Comprehensive music education program offering graded exams and professional qualifications.',
  features: [
    {
      title: 'RSL Certification',
      description: 'Internationally recognized music qualifications',
      icon: Music,
    },
    {
      title: 'Professional Studios',
      description: 'State-of-the-art recording and practice facilities',
      icon: Mic,
    },
    {
      title: 'Live Performance',
      description: 'Regular performance opportunities and showcases',
      icon: Radio,
    },
    {
      title: 'Industry Experience',
      description: 'Learn from working industry professionals',
      icon: Headphones,
    }
  ],
  phases: [
    {
      title: 'Music Performance',
      description: 'Master musical instruments and performance techniques.',
      icon: Piano,
      levels: ["Foundation", "Intermediate", "Advanced", "Professional"],
      instruments: ["Piano", "Guitar", "Drums", "Vocals"]
    },
    {
      title: 'Music Production',
      description: 'Learn professional music production and sound engineering.',
      icon: Headphones,
      levels: ["Basic Production", "Advanced DAW", "Mixing", "Mastering"],
      software: ["Logic Pro", "Ableton Live", "Pro Tools", "FL Studio"]
    },
    {
      title: 'Sound Engineering',
      description: 'Master the art and science of sound engineering.',
      icon: Speaker,
      areas: ["Studio Recording", "Live Sound", "Acoustics", "Signal Processing"],
      equipment: ["Mixing Consoles", "Microphones", "Processors", "PA Systems"]
    },
    {
      title: 'Digital Arts',
      description: 'Create compelling visual content for music and media.',
      icon: Film,
      skills: ["Video Production", "Motion Graphics", "Visual Effects", "Color Grading"],
      tools: ["Adobe Premiere", "After Effects", "DaVinci Resolve"]
    }
  ],
  benefits: [
    'Professional studio access',
    'Industry mentor guidance',
    'Portfolio development',
    'Live performance opportunities',
    'Networking events',
    'Collaboration projects',
    'Marketing support',
    'Career guidance'
  ],
  schedule: {
    title: 'Program Schedule',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    times: [
      'Studio Sessions: Flexible booking',
      'Workshops: Weekly 3-hour sessions',
      'Mentoring: Bi-weekly meetings'
    ]
  },
  certifications: [
    'Ableton Live Certification',
    'Pro Tools Operator',
    'Logic Pro X Certification',
    'Music Production & Sound Design',
    'Studio Engineering'
  ],
  overviewImage: '/images/programs/white-noise/overview.jpg'
};

export default function WhiteNoiseAcademyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        title="White Noise Academy"
        subtitle="RSL Club for Music and Digital Arts"
        description="Comprehensive music education program offering graded exams and professional qualifications."
        imageSrc="/images/programs/white-noise/hero.jpg"
        ctaText="Begin Your Journey"
        ctaHref="#enroll"
      />

      <section className="py-20">
        <ProgramDetailCard {...programData} />
      </section>
    </div>
  );
}

import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import React from 'react';
import YouTubeEmbed from './YouTubeEmbed';
import StagesSlideshow from './StagesSlideshow';

interface Feature {
  title: string;
  description: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
}

interface Phase {
  title: string;
  description: string;
  image?: string;
}

interface ProgramDetailCardProps {
  variant: 'adults' | 'schooling' | 'afterschool' | 'academy';
  title: string;
  subtitle: string;
  description: string;
  features: Feature[];
  phases?: Phase[];
  benefits: string[];
  schedule?: {
    title: string;
    times: string[];
  };
  certifications?: string[];
  showSlideshow?: boolean;
  overviewImage?: string;
  youtubeVideoId?: string;
}

const variants = {
  adults: {
    bg: 'from-purple-600 to-purple-800',
    accent: 'bg-purple-500',
    hover: 'hover:bg-purple-700',
  },
  schooling: {
    bg: 'from-rose-600 to-rose-800',
    accent: 'bg-rose-500',
    hover: 'hover:bg-rose-700',
  },
  afterschool: {
    bg: 'from-teal-600 to-teal-800',
    accent: 'bg-teal-500',
    hover: 'hover:bg-teal-700',
  },
  academy: {
    bg: 'from-blue-600 to-blue-800',
    accent: 'bg-blue-500',
    hover: 'hover:bg-blue-700',
  },
};

const schoolingStages = [
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
];

const ProgramDetailCard: React.FC<ProgramDetailCardProps> = ({
  variant,
  title,
  subtitle,
  description,
  features,
  phases,
  benefits,
  schedule,
  certifications,
  showSlideshow = false,
  overviewImage,
  youtubeVideoId,
}) => {
  const style = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Content */}
      <div className="bg-white rounded-2xl shadow-xl">
        {/* Description */}
        <div className="p-8 border-b">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">{title}</h2>
          <p className="text-lg text-gray-600 mb-4">{subtitle}</p>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Features */}
        <div className="p-8 border-b">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex space-x-4">
                <div className={`${style.accent} p-2 rounded-lg h-10 w-10 flex-shrink-0`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overview Image or Slideshow for Schooling */}
        {variant === 'schooling' && (
          <div className="p-8 border-b">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Program Overview</h3>
            <StagesSlideshow stages={schoolingStages} />
          </div>
        )}

        {/* Phases */}
        {phases && phases.length > 0 && (
          <div className="p-8 border-b">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Development Phases</h3>
            <div className="space-y-6">
              {phases.map((phase, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`${style.accent} rounded-full h-8 w-8 flex items-center justify-center text-white font-bold flex-shrink-0`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{phase.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* YouTube Video */}
        {youtubeVideoId && (
          <div className="p-8 border-b">
            <YouTubeEmbed videoId={youtubeVideoId} />
          </div>
        )}

        {/* Benefits */}
        <div className="p-8 border-b">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Program Benefits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <ChevronRightIcon className={`h-5 w-5 ${style.accent} text-white rounded`} />
                <span className="text-gray-600">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        {schedule && (
          <div className="p-8 border-b">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">{schedule.title}</h3>
            <div className="space-y-2">
              {schedule.times.map((time, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <ChevronRightIcon className={`h-5 w-5 ${style.accent} text-white rounded`} />
                  <span className="text-gray-600">{time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overview Image for non-Schooling */}
        {variant !== 'schooling' && overviewImage && (
          <div className="p-8 border-b">
            <img
              src={overviewImage}
              alt="Program Overview"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Certifications</h3>
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <ChevronRightIcon className={`h-5 w-5 ${style.accent} text-white rounded`} />
                  <span className="text-gray-600">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProgramDetailCard;

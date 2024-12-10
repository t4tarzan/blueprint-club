import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import React from 'react';
import StagesSlideshow from './StagesSlideshow';
import YouTubeEmbed from './YouTubeEmbed';

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
  variant: 'adults' | 'schooling' | 'afterschool' | 'music';
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
    bg: 'from-blue-600 to-blue-800',
    accent: 'bg-blue-500',
    hover: 'hover:bg-blue-700',
  },
  schooling: {
    bg: 'from-purple-600 to-purple-800',
    accent: 'bg-purple-500',
    hover: 'hover:bg-purple-700',
  },
  afterschool: {
    bg: 'from-teal-600 to-teal-800',
    accent: 'bg-teal-500',
    hover: 'hover:bg-teal-700',
  },
  music: {
    bg: 'from-rose-600 to-rose-800',
    accent: 'bg-rose-500',
    hover: 'hover:bg-rose-700',
  },
};

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
      {/* Header */}
      <div className={`bg-gradient-to-r ${style.bg} p-8 rounded-t-2xl text-white`}>
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-lg opacity-90">{subtitle}</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-b-2xl shadow-xl">
        {/* Description */}
        <div className="p-8 border-b">
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Phases */}
        {phases && phases.length > 0 && (
          <div className="p-8 border-t">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Development Phases</h3>
            <div className="space-y-4">
              {phases.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className={`flex-shrink-0 w-8 h-8 ${style.accent} rounded-full flex items-center justify-center text-white font-semibold`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{phase.title}</h4>
                    <p className="text-sm text-gray-600">{phase.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* YouTube Video Section */}
        {(variant === 'music' || variant === 'schooling') && youtubeVideoId && (
          <div className="mt-12 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {variant === 'music' ? 'Featured Performance' : 'Program Overview'}
            </h3>
            <YouTubeEmbed videoId={youtubeVideoId} />
          </div>
        )}

        {/* Features */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start space-x-4"
            >
              <div className={`p-2 ${style.accent} rounded-lg text-white`}>
                {feature.icon && <feature.icon className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Slideshow */}
        {showSlideshow && overviewImage && phases && (
          <div className="p-8 border-t">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Program Journey</h3>
            <div className="relative w-full mx-auto" style={{ maxWidth: '800px' }}>
              <StagesSlideshow stages={phases} overviewImage={overviewImage} />
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="p-8 border-t bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <ChevronRightIcon className={`w-5 h-5 text-${variant === 'adults' ? 'blue' : variant === 'schooling' ? 'purple' : variant === 'afterschool' ? 'teal' : 'rose'}-500`} />
                <span className="text-gray-700">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        {schedule && (
          <div className="p-8 border-t">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{schedule.title}</h3>
            <div className="space-y-2">
              {schedule.times.map((time, index) => (
                <p key={index} className="text-gray-600">{time}</p>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && (
          <div className="p-8 border-t">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${style.accent} text-white`}
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProgramDetailCard;

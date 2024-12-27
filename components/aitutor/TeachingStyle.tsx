import React from 'react';
import { motion } from 'framer-motion';

export type TeachingStyle = 
  | 'step-by-step'
  | 'quick-response'
  | 'interactive';

interface TeachingStyleSelectorProps {
  selectedStyle: TeachingStyle;
  onStyleSelect: (style: TeachingStyle) => void;
}

const teachingStyles = {
  'step-by-step': {
    icon: '📝',
    title: 'Step by Step',
    features: [
      'Detailed steps',
      'Visual examples',
      'Practice problems',
      'Related concepts'
    ]
  },
  'quick-response': {
    icon: '⚡',
    title: 'Quick Response',
    features: [
      'Direct answers',
      'Key formulas',
      'Quick examples',
      'Core concepts'
    ]
  },
  'interactive': {
    icon: '🤝',
    title: 'Interactive',
    features: [
      'Real-time guidance',
      'Step validation',
      'Adaptive learning',
      'Practice-based'
    ]
  }
};

const FeatureList: React.FC<{
  style: TeachingStyle;
}> = ({ style }) => (
  <div className="flex flex-wrap gap-1.5 mt-1">
    {teachingStyles[style].features.map((feature, index) => (
      <span 
        key={index} 
        className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
      >
        {feature}
      </span>
    ))}
  </div>
);

export const TeachingStyleSelector: React.FC<TeachingStyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {(Object.keys(teachingStyles) as TeachingStyle[]).map((style) => (
          <motion.button
            key={style}
            className={`px-3 py-1.5 rounded-lg cursor-pointer flex items-center ${
              selectedStyle === style
                ? 'bg-blue-100 border border-blue-500'
                : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-blue-300'
            }`}
            onClick={() => onStyleSelect(style)}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg mr-2">{teachingStyles[style].icon}</span>
            <span className="text-sm font-medium">{teachingStyles[style].title}</span>
          </motion.button>
        ))}
      </div>
      <FeatureList style={selectedStyle} />
    </div>
  );
};

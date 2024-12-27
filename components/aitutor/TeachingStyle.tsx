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
    description: 'Detailed explanations with clear steps',
    details: [
      'Comprehensive concept breakdowns',
      'Visual examples and diagrams',
      'Practice problems with solutions',
      'Related concepts and applications'
    ]
  },
  'quick-response': {
    icon: '⚡',
    title: 'Quick Response',
    description: 'Fast, concise explanations',
    details: [
      'Direct answers and solutions',
      'Key formulas and methods',
      'Quick reference examples',
      'Essential concepts only'
    ]
  },
  'interactive': {
    icon: '🤝',
    title: 'Interactive',
    description: 'Interactive problem-solving',
    details: [
      'Real-time guidance and feedback',
      'Step-by-step validation',
      'Adaptive difficulty levels',
      'Practice-based learning'
    ]
  }
};

const FeatureCard: React.FC<{
  style: TeachingStyle;
}> = ({ style }) => (
  <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-4 mt-4">
    <div className="flex items-center mb-2">
      <span className="text-2xl mr-2">{teachingStyles[style].icon}</span>
      <h3 className="font-semibold text-gray-800">{teachingStyles[style].title}</h3>
    </div>
    <p className="text-sm text-gray-600 mb-3">{teachingStyles[style].description}</p>
    <div className="flex flex-wrap gap-2">
      {teachingStyles[style].details.map((detail, index) => (
        <span 
          key={index} 
          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
        >
          {detail}
        </span>
      ))}
    </div>
  </div>
);

export const TeachingStyleSelector: React.FC<TeachingStyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(Object.keys(teachingStyles) as TeachingStyle[]).map((style) => (
          <motion.button
            key={style}
            className={`p-3 rounded-lg cursor-pointer flex items-center ${
              selectedStyle === style
                ? 'bg-blue-100 border-2 border-blue-500 shadow-sm'
                : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-blue-300'
            }`}
            onClick={() => onStyleSelect(style)}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-xl mr-2">{teachingStyles[style].icon}</div>
            <div>
              <h3 className="font-medium text-sm">{teachingStyles[style].title}</h3>
              <p className="text-xs text-gray-600">{teachingStyles[style].description}</p>
            </div>
          </motion.button>
        ))}
      </div>
      <FeatureCard style={selectedStyle} />
    </div>
  );
};

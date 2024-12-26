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
    description: 'Detailed explanations with clear steps'
  },
  'quick-response': {
    icon: '⚡',
    title: 'Quick Response',
    description: 'Fast, concise explanations'
  },
  'interactive': {
    icon: '🤝',
    title: 'Interactive',
    description: 'Interactive problem-solving'
  }
};

export const TeachingStyleSelector: React.FC<TeachingStyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
}) => {
  return (
    <div className="flex gap-4 p-4">
      {(Object.keys(teachingStyles) as TeachingStyle[]).map((style) => (
        <motion.div
          key={style}
          className={`relative p-4 rounded-lg cursor-pointer ${
            selectedStyle === style
              ? 'bg-blue-50 border-2 border-blue-500'
              : 'bg-white border border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => onStyleSelect(style)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-2xl mb-2">{teachingStyles[style].icon}</div>
          <h3 className="font-medium text-sm mb-1">{teachingStyles[style].title}</h3>
          <p className="text-xs text-gray-600">{teachingStyles[style].description}</p>
        </motion.div>
      ))}
    </div>
  );
};

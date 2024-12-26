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
    <div className="flex gap-2 p-2">
      {(Object.keys(teachingStyles) as TeachingStyle[]).map((style) => (
        <motion.div
          key={style}
          className={`relative p-2 rounded-lg cursor-pointer flex items-center ${
            selectedStyle === style
              ? 'bg-blue-50 border-2 border-blue-500'
              : 'bg-white border border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => onStyleSelect(style)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-xl mr-2">{teachingStyles[style].icon}</div>
          <div>
            <h3 className="font-medium text-xs mb-0.5">{teachingStyles[style].title}</h3>
            <p className="text-[10px] text-gray-600 leading-tight">{teachingStyles[style].description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

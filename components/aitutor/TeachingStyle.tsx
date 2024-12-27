import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const HoverCard: React.FC<{
  style: TeachingStyle;
  isVisible: boolean;
}> = ({ style, isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      >
        <div className="p-4">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-2">{teachingStyles[style].icon}</span>
            <h3 className="font-semibold text-gray-800">{teachingStyles[style].title}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">{teachingStyles[style].description}</p>
          <ul className="space-y-2">
            {teachingStyles[style].details.map((detail, index) => (
              <li key={index} className="text-xs text-gray-700 flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const TeachingStyleSelector: React.FC<TeachingStyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
}) => {
  const [hoveredStyle, setHoveredStyle] = useState<TeachingStyle | null>(null);

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
          onMouseEnter={() => setHoveredStyle(style)}
          onMouseLeave={() => setHoveredStyle(null)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-xl mr-2">{teachingStyles[style].icon}</div>
          <div>
            <h3 className="font-medium text-xs mb-0.5">{teachingStyles[style].title}</h3>
            <p className="text-[10px] text-gray-600 leading-tight">{teachingStyles[style].description}</p>
          </div>
          <HoverCard style={style} isVisible={hoveredStyle === style} />
        </motion.div>
      ))}
    </div>
  );
};

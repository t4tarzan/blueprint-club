import React from 'react';
import { motion } from 'framer-motion';

export type TeachingStyle = 
  | 'step-by-step'
  | 'quick-response'
  | 'interactive';

export type StepByStepFeature = 'steps' | 'visual' | 'practice' | 'concepts';

interface TeachingStyleSelectorProps {
  selectedStyle: TeachingStyle;
  onStyleSelect: (style: TeachingStyle) => void;
  onFeatureSelect?: (feature: StepByStepFeature) => void;
  selectedFeature?: StepByStepFeature;
}

const teachingStyles = {
  'step-by-step': {
    icon: '📝',
    title: 'Step by Step',
    features: [
      { id: 'steps', label: 'Detailed steps' },
      { id: 'visual', label: 'Visual examples' },
      { id: 'practice', label: 'Practice problems' },
      { id: 'concepts', label: 'Related concepts' }
    ]
  },
  'quick-response': {
    icon: '⚡',
    title: 'Quick Response',
    features: [
      { id: 'steps', label: 'Direct answers' },
      { id: 'steps', label: 'Key formulas' },
      { id: 'steps', label: 'Quick examples' },
      { id: 'steps', label: 'Core concepts' }
    ]
  },
  'interactive': {
    icon: '💎',
    title: 'Interactive',
    features: [
      { id: 'steps', label: 'Real-time guidance' },
      { id: 'steps', label: 'Step validation' },
      { id: 'steps', label: 'Adaptive learning' },
      { id: 'steps', label: 'Practice-based' }
    ]
  }
} as const;

interface FeatureListProps {
  features: readonly { readonly id: StepByStepFeature; readonly label: string }[];
  onFeatureSelect?: (feature: StepByStepFeature) => void;
  selectedFeature?: StepByStepFeature;
}

const FeatureList: React.FC<FeatureListProps> = ({
  features,
  onFeatureSelect,
  selectedFeature
}) => (
  <div className="space-y-1">
    {features.map(({ id, label }) => (
      <motion.button
        key={id}
        className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
          selectedFeature === id
            ? 'bg-indigo-100 text-indigo-700 font-medium'
            : 'hover:bg-gray-50 text-gray-700'
        }`}
        onClick={() => onFeatureSelect?.(id)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {label}
      </motion.button>
    ))}
  </div>
);

export const TeachingStyleSelector: React.FC<TeachingStyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
  onFeatureSelect,
  selectedFeature
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-3">
        {Object.entries(teachingStyles).map(([style, { icon, title }]) => (
          <motion.button
            key={style}
            className={`px-4 py-2 rounded-lg border shadow-sm transition-colors flex items-center gap-2 ${
              selectedStyle === style
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onStyleSelect(style as TeachingStyle)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-xl">{icon}</span>
            <span className="font-medium text-sm whitespace-nowrap">{title}</span>
          </motion.button>
        ))}
      </div>
      {selectedStyle === 'step-by-step' && onFeatureSelect && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 mt-1.5"
        >
          {teachingStyles['step-by-step'].features.map(({ id, label }) => (
            <motion.button
              key={id}
              className={`text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                selectedFeature === id
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => onFeatureSelect?.(id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {label}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

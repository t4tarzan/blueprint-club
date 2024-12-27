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
      { id: 'steps', label: 'Detailed Steps' },
      { id: 'visual', label: 'Visualize' },
      { id: 'practice', label: 'Practice' },
      { id: 'concepts', label: 'Learn More' }
    ]
  },
  'quick-response': {
    icon: '⚡',
    title: 'Quick Response',
    features: [
      { id: 'steps', label: 'Answer' },
      { id: 'visual', label: 'Graph' },
      { id: 'practice', label: 'Try It' },
      { id: 'concepts', label: 'Theory' }
    ]
  },
  'interactive': {
    icon: '💎',
    title: 'Interactive',
    features: [
      { id: 'steps', label: 'Guide' },
      { id: 'visual', label: 'Explore' },
      { id: 'practice', label: 'Solve' },
      { id: 'concepts', label: 'Master' }
    ]
  }
};

const FeatureList: React.FC<{
  style: TeachingStyle;
  onFeatureSelect?: (feature: StepByStepFeature) => void;
  selectedFeature?: StepByStepFeature;
}> = ({ style, onFeatureSelect, selectedFeature }) => (
  <div className="flex flex-wrap gap-1.5 mt-1">
    {teachingStyles[style].features.map((feature, index) => (
      <motion.button
        key={index}
        onClick={() => onFeatureSelect?.(feature.id as StepByStepFeature)}
        className={`text-xs px-3 py-1 rounded-full transition-colors ${
          selectedFeature === feature.id
            ? 'bg-blue-500 text-white font-medium'
            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        {feature.label}
      </motion.button>
    ))}
  </div>
);

export const TeachingStyleSelector: React.FC<TeachingStyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
  onFeatureSelect,
  selectedFeature,
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
      <FeatureList 
        style={selectedStyle}
        onFeatureSelect={onFeatureSelect}
        selectedFeature={selectedFeature}
      />
    </div>
  );
};

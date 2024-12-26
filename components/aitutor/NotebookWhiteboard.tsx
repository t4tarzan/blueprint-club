import React, { useMemo } from 'react';
import { HandwrittenText } from './HandwrittenText';
import { TeachingStyle } from '@/types/aitutor';
import '@/styles/notebook.css';

interface NotebookWhiteboardProps {
  content: string;
  teachingStyle: TeachingStyle;
  isProcessing?: boolean;
}

const lineColors = {
  0: 'text-blue-600',
  1: 'text-purple-600',
  2: 'text-green-600',
  3: 'text-red-600',
} as const;

export const NotebookWhiteboard: React.FC<NotebookWhiteboardProps> = ({
  content,
  teachingStyle,
  isProcessing = false,
}) => {
  const lines = useMemo(() => {
    if (Array.isArray(content)) {
      return content;
    }
    return content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[•*#\s]+/, '').trim()); // Remove leading symbols
  }, [content]);

  const getLineColor = (index: number): string => {
    const colorIndex = index % Object.keys(lineColors).length;
    return lineColors[colorIndex as keyof typeof lineColors];
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(#f0f0f0 1px, transparent 1px)',
        backgroundSize: '100% 2rem',
        backgroundPosition: '0 0',
        backgroundColor: 'white',
      }}
    >
      {/* Left margin line */}
      <div 
        className="absolute left-12 top-0 bottom-0 w-0.5 bg-red-200"
        style={{ zIndex: 1 }}
      />

      {/* Content Area with custom scrollbar */}
      <div className="w-full h-full px-16 py-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-2"> {/* Reduced spacing between lines */}
          {lines.map((line, index) => (
            <HandwrittenText
              key={index}
              text={line}
              color={getLineColor(index)}
              isStep={teachingStyle === 'step-by-step'}
              className="leading-relaxed" // Adjusted line height
            />
          ))}
          {isProcessing && (
            <div className="animate-pulse flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

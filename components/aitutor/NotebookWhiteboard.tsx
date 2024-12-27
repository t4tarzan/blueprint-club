import React, { useMemo } from 'react';
import { HandwrittenText } from './HandwrittenText';
import { TeachingStyle } from '@/types/aitutor';
import '@/styles/notebook.css';

interface NotebookWhiteboardProps {
  content: string;
  teachingStyle: TeachingStyle;
  isProcessing?: boolean;
  selectedSubject?: 'math' | 'science' | null;
  graphData?: any;
}

export const NotebookWhiteboard: React.FC<NotebookWhiteboardProps> = ({
  content,
  teachingStyle,
  isProcessing = false,
  selectedSubject,
  graphData,
}) => {
  const lines = useMemo(() => {
    if (Array.isArray(content)) {
      return content;
    }
    return content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim());
  }, [content]);

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
        <div className="space-y-1"> {/* Tighter spacing between lines */}
          {lines.map((line, index) => (
            <HandwrittenText
              key={index}
              text={line}
              isMainPoint={line.toLowerCase().includes('step') || line.toLowerCase().includes('therefore')}
              className="leading-relaxed"
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

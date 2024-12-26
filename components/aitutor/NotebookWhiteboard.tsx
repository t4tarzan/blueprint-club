import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { HandwrittenText } from './HandwrittenText';
import type { TeachingStyle } from './TeachingStyle';

// Import GraphDisplay component dynamically to avoid SSR issues
const GraphDisplay = dynamic(() => import('./GraphDisplay'), { ssr: false });

interface NotebookWhiteboardProps {
  content: string;
  isProcessing: boolean;
  selectedSubject: 'math' | 'science' | null;
  graphData?: any;
  teachingStyle: TeachingStyle;
}

export const NotebookWhiteboard: React.FC<NotebookWhiteboardProps> = ({
  content,
  isProcessing,
  selectedSubject,
  graphData,
  teachingStyle
}) => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    if (content) {
      const newLines = content.split('\n').filter(line => line.trim());
      setLines(newLines);
    }
  }, [content]);

  const getWritingSpeed = () => {
    switch (teachingStyle) {
      case 'quick-response':
        return 20;
      case 'step-by-step':
        return 40;
      case 'interactive':
        return 30;
      default:
        return 30;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto">
      <div className="relative min-h-full">
        {/* Graph Area */}
        {graphData && Object.keys(graphData).length > 0 && (
          <div className="mb-6">
            <GraphDisplay graphData={graphData} />
          </div>
        )}

        {/* Content Area */}
        <div className="whitespace-pre-wrap font-notebook text-lg leading-relaxed">
          {isProcessing ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <HandwrittenText
              text={lines.join('\n')}
              speed={getWritingSpeed()}
              className="space-y-2"
            />
          )}
        </div>
      </div>
    </div>
  );
};

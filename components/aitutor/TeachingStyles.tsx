import React from 'react';
import { NotebookWhiteboard } from './NotebookWhiteboard';
import type { WhiteboardContent, ContentSection } from '@/types/aitutor';

interface TeachingStylesProps {
  content: WhiteboardContent;
  isProcessing?: boolean;
  activeSection: ContentSection;
}

export const TeachingStyles: React.FC<TeachingStylesProps> = ({
  content,
  isProcessing,
  activeSection
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      <NotebookWhiteboard
        content={content}
        isProcessing={isProcessing}
        activeSection={activeSection}
      />
    </div>
  );
};

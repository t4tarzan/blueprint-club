import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { HandwrittenText } from './HandwrittenText';
import { WhiteboardContent, ContentSection, ConceptInfo } from '@/types/aitutor';
import '@/styles/notebook.css';

// Import GraphDisplay component dynamically to avoid SSR issues
const GraphDisplay = dynamic(() => import('./GraphDisplay'), { ssr: false });

interface NotebookWhiteboardProps {
  content: WhiteboardContent;
  activeSection: ContentSection;
  theme?: 'light' | 'dark';
  isProcessing?: boolean;
}

export const NotebookWhiteboard: React.FC<NotebookWhiteboardProps> = ({
  content = {},
  activeSection,
  theme = 'light',
  isProcessing = false
}) => {
  const isDark = theme === 'dark';
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    console.log('=== NotebookWhiteboard Content Update ===');
    console.log('Active Section:', activeSection);
    console.log('Raw Content:', JSON.stringify(content, null, 2));
    
    // Get content for the active section
    const sectionContent = content[activeSection];
    console.log('Section Content:', JSON.stringify(sectionContent, null, 2));
    
    // Handle visual section separately
    if (activeSection === 'visual') {
      console.log('Visual section detected');
      setLines([]);  // Clear lines for visual section
      return;
    }

    // Convert section content to lines based on type
    let textContent = '';
    if (activeSection === 'steps') {
      textContent = sectionContent as string || '';
    } else if (activeSection === 'practice' && sectionContent && typeof sectionContent === 'object') {
      const practiceContent = sectionContent as { problems: Array<{ question: string, difficulty?: string, solution: string }> };
      if (Array.isArray(practiceContent.problems)) {
        textContent = practiceContent.problems
          .map((p, i) => `Problem ${i + 1}:\n${p.question}\n\nDifficulty: ${p.difficulty || 'Medium'}\n\nSolution:\n${p.solution}`)
          .join('\n\n');
      }
    } else if (activeSection === 'concepts' && sectionContent && typeof sectionContent === 'object') {
      const conceptsContent = sectionContent as ConceptInfo;
      textContent = `${conceptsContent.title}\n\n${conceptsContent.description}\n\nRelated Topics:\n` +
        conceptsContent.relatedTopics.map(topic => `• ${topic.name}: ${topic.description}`).join('\n');
    }

    // Split content into lines and update state
    setLines(textContent.split('\n'));
  }, [activeSection, content]);

  const renderContent = () => {
    if (isProcessing) {
      return (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      );
    }

    if (activeSection === 'visual' && content.visual) {
      console.log('Rendering visual content:', content.visual);
      return (
        <div className="flex justify-center items-center h-full py-4">
          <GraphDisplay data={content.visual} />
        </div>
      );
    }

    return (
      <div className="whitespace-pre-wrap">
        <HandwrittenText lines={lines} />
      </div>
    );
  };

  return (
    <div className="h-full notebook-paper">
      <div className="relative min-h-full">
        {/* Left margin line */}
        <div 
          className="absolute left-12 top-0 bottom-0 w-0.5 bg-red-200"
          style={{ zIndex: 1 }}
        />

        {/* Content Area with Scrollbar */}
        <div className="w-full h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
          <div className="px-16 py-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

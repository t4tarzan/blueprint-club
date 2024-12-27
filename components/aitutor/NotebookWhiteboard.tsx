import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { HandwrittenText } from './HandwrittenText';
import { WhiteboardContent, ContentSection } from '@/types/aitutor';
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
    
    // Handle text sections
    if (typeof sectionContent === 'string') {
      // Remove any "No X available" messages
      const cleanContent = sectionContent
        .replace(/Your Question:.*?\n/g, '')
        .replace(/No .*? available/g, '')
        .replace(/Loading .*?\.\.\./g, '')
        .trim();
      
      console.log('Clean content:', cleanContent);
      
      if (cleanContent) {
        const newLines = cleanContent
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        console.log('Final Lines:', newLines);
        setLines(newLines);
      } else {
        console.log('No valid content after cleaning');
        setLines([]);
      }
    } else {
      console.log('Invalid content type:', typeof sectionContent);
      setLines([]);
    }
  }, [content, activeSection]);

  const renderContent = () => {
    console.log('=== Rendering Content ===');
    console.log('Active Section:', activeSection);
    console.log('Content for section:', content[activeSection]);
    console.log('Lines:', lines);
    console.log('Visual Data:', content.visual);

    if (isProcessing) {
      return (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      );
    }

    // Handle visual section
    if (activeSection === 'visual' && content.visual?.type === 'function') {
      return <GraphDisplay data={content.visual} />;
    }

    // Handle empty state for each section
    if (!content[activeSection] || (Array.isArray(lines) && lines.length === 0)) {
      return (
        <p className="text-gray-500 italic">
          {activeSection === 'steps' && 'Ask me a question to begin...'}
          {activeSection === 'visual' && 'Visual content will appear here when available...'}
          {activeSection === 'practice' && 'Practice problems will appear here...'}
          {activeSection === 'concepts' && 'Key concepts will be explained here...'}
        </p>
      );
    }

    // Render text content with handwritten effect
    return (
      <HandwrittenText
        text={typeof content[activeSection] === 'string' ? content[activeSection] : lines.join('\n')}
        speed={30}
        className="space-y-4 whitespace-pre-wrap"
      />
    );
  };

  return (
    <div className="h-full overflow-y-auto notebook-paper">
      <div className="relative min-h-full">
        {/* Left margin line */}
        <div 
          className="absolute left-12 top-0 bottom-0 w-0.5 bg-red-200"
          style={{ zIndex: 1 }}
        />

        {/* Content Area */}
        <div className="w-full h-full px-16 py-4">
          <div className="whitespace-pre-wrap font-handwritten text-lg leading-relaxed">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

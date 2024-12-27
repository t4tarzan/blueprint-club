import React from 'react';
import { MathRenderer } from './MathRenderer';

interface HandwrittenTextProps {
  text: string;
  className?: string;
  isMainPoint?: boolean;
}

export const HandwrittenText: React.FC<HandwrittenTextProps> = ({
  text,
  className = '',
  isMainPoint = false,
}) => {
  const cleanText = (text: string): string => {
    // Remove code block markers and bullet points
    let cleaned = text.replace(/```[^`]*```/g, '');
    cleaned = cleaned.replace(/^[•*#\s]+/gm, '');
    cleaned = cleaned.trim();
    
    // Format equations with proper spacing
    cleaned = cleaned.replace(/([+\-=])/g, ' $1 ').trim();
    
    return cleaned;
  };

  // Function to parse text and identify math expressions
  const renderContent = () => {
    const parts = cleanText(text).split(/(\$.*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        // Remove the $ symbols and render as math
        const mathContent = part.slice(1, -1);
        return (
          <MathRenderer
            key={index}
            math={mathContent}
            inline={true}
            className="mx-1"
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div 
      className={`${className} ${isMainPoint ? 'text-blue-600 font-semibold' : 'text-gray-800'}`}
      style={{
        fontFamily: 'Kalam, cursive',
        letterSpacing: '0.5px',
        lineHeight: '1.4'
      }}
    >
      {renderContent()}
    </div>
  );
};

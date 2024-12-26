import React from 'react';
import { MathRenderer } from './MathRenderer';

interface HandwrittenTextProps {
  text: string;
  className?: string;
  color?: string;
  isStep?: boolean;
}

export const HandwrittenText: React.FC<HandwrittenTextProps> = ({
  text,
  className = '',
  color = 'text-gray-800',
  isStep = false,
}) => {
  const stepPrefix = isStep ? '• ' : '';
  
  const cleanText = (text: string): string => {
    // Remove markdown code blocks
    let cleaned = text.replace(/```[^`]*```/g, '');
    
    // Remove bullet points, asterisks, and hashes
    cleaned = cleaned.replace(/^[•*#\s]+/gm, '');
    
    // Replace "square" with "²" and properly format exponents
    cleaned = cleaned.replace(/\b(\w+)\s+square\b/gi, '$1²');
    
    // Clean up extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
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
      className={`${className} ${color}`}
      style={{
        fontFamily: 'Kalam, cursive',
        letterSpacing: '0.5px',
        lineHeight: '1.4'
      }}
    >
      {stepPrefix}{renderContent()}
    </div>
  );
};

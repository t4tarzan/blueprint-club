import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface HandwrittenTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export const HandwrittenText: React.FC<HandwrittenTextProps> = ({
  text,
  speed = 30,
  className = ''
}) => {
  const formatLine = (line: string) => {
    // Check for headings (lines starting with 'Step', 'Question:', etc.)
    if (line.match(/^(Step \d+:|Question:|Visual Aid:|Practice Problems:|Key Concepts:)/)) {
      return `<span class="text-blue-600 font-semibold">${line}</span>`;
    }
    // Check for bullet points
    if (line.startsWith('•')) {
      return `<span class="text-gray-800">${line}</span>`;
    }
    // Check for numbered items
    if (line.match(/^\d+\./)) {
      return `<span class="text-gray-800">${line}</span>`;
    }
    return line;
  };

  const lines = text.split('\n');

  return (
    <div 
      className={className}
      style={{
        fontFamily: 'Kalam, cursive',
        letterSpacing: '0.5px',
        lineHeight: '1.4'
      }}
    >
      {lines.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: index * (speed / 1000),
            ease: 'easeOut'
          }}
          className="font-handwritten"
        >
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              p: ({ children }) => (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: formatLine(children.toString()) 
                  }} 
                />
              ),
            }}
          >
            {line || '\u00A0'}
          </ReactMarkdown>
        </motion.div>
      ))}
    </div>
  );
};

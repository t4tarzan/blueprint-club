import React from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface MathRendererProps {
  math: string;
  inline?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ 
  math, 
  inline = true,
  className = ''
}) => {
  const htmlString = katex.renderToString(math, {
    throwOnError: false,
    displayMode: !inline,
    strict: false
  });

  return (
    <span 
      className={`math-renderer ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlString }}
      style={{ fontFamily: 'KaTeX_Main' }}
    />
  );
};

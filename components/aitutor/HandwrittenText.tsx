import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface HandwrittenTextProps {
  text: string;
  className?: string;
  speed?: number; // milliseconds per character
  delay?: number;
  onComplete?: () => void;
  color?: string;
  isStep?: boolean;
}

export const HandwrittenText: React.FC<HandwrittenTextProps> = ({
  text,
  className = '',
  speed = 50,
  delay = 0,
  onComplete,
  color = 'text-gray-800',
  isStep = false,
}) => {
  const controls = useAnimation();
  const [displayText, setDisplayText] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let currentText = '';
    let currentIndex = 0;

    const writeText = () => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex];
        setDisplayText(currentText);
        currentIndex++;
        timeoutRef.current = setTimeout(writeText, speed);
      } else {
        onComplete?.();
      }
    };

    timeoutRef.current = setTimeout(() => {
      controls.start({ opacity: 1 });
      writeText();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, delay, controls, onComplete]);

  // Split text into lines for better animation
  const lines = displayText.split('\n');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={controls}
      className={`font-kalam ${className} ${color} ${
        isStep ? 'border-l-4 border-blue-400 pl-4' : ''
      }`}
    >
      {lines.map((line, index) => (
        <div
          key={index}
          className={`leading-relaxed ${line.trim().startsWith('Step') ? 'text-blue-600 font-semibold' : ''} ${
            line.trim().startsWith('Final') ? 'text-green-600 font-semibold' : ''
          }`}
        >
          {line || '\u00A0'}
        </div>
      ))}
    </motion.div>
  );
};

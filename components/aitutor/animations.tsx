import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

// Writing Animation
interface WritingAnimationProps {
  text: string;
  className?: string;
  speed?: number;
}

export function WritingAnimation({ text, className = '', speed = 50 }: WritingAnimationProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <motion.div
      className={`writing-animation font-chalk ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          className="cursor"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          |
        </motion.span>
      )}
    </motion.div>
  );
}

// Chalk Dust Effect
interface ChalkDustProps {
  active?: boolean;
}

export function ChalkDust({ active = true }: ChalkDustProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {active && (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                initial={{ 
                  x: `${Math.random() * 100}%`,
                  y: '0%',
                  opacity: 1
                }}
                animate={{ 
                  y: '100%',
                  opacity: 0
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Eraser Effect
interface EraserEffectProps {
  onComplete?: () => void;
}

export function EraserEffect({ onComplete }: EraserEffectProps) {
  return (
    <motion.div
      className="absolute inset-0 bg-white/90"
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      onAnimationComplete={onComplete}
    >
      <div className="absolute inset-0 blur-sm bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </motion.div>
  );
}

// Solution Step Animation
const stepVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.3,
    },
  }),
};

interface AnimatedStepProps {
  step: number;
  children: React.ReactNode;
}

export function AnimatedStep({ step, children }: AnimatedStepProps) {
  return (
    <motion.div
      custom={step}
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {children}
      <ChalkDust />
    </motion.div>
  );
}

// Teacher Speaking Animation
interface SpeakingIndicatorProps {
  isActive: boolean;
}

export function SpeakingIndicator({ isActive }: SpeakingIndicatorProps) {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-green-500 rounded-full"
          animate={isActive ? {
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          } : {
            scale: 1,
            opacity: 0.5,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

// Loading Animation
export function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

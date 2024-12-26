import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { motion } from 'framer-motion';

interface MathRendererProps {
  content: string;
  display?: boolean;
  className?: string;
}

export function MathRenderer({ content, display = false, className = '' }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(content, containerRef.current, {
          displayMode: display,
          throwOnError: false,
          strict: false,
          trust: true,
          macros: {
            // Common math macros
            '\\R': '\\mathbb{R}',
            '\\N': '\\mathbb{N}',
            '\\Z': '\\mathbb{Z}',
            '\\Q': '\\mathbb{Q}',
            '\\diff': '\\mathrm{d}',
            '\\grad': '\\nabla',
            '\\pd': '\\partial',
          },
        });
      } catch (error) {
        console.error('Error rendering math:', error);
        containerRef.current.textContent = content;
      }
    }
  }, [content, display]);

  return (
    <motion.div
      ref={containerRef}
      className={`math-renderer ${display ? 'math-display' : 'math-inline'} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    />
  );
}

// Solution Step component with math support
interface SolutionStepProps {
  step: number;
  content: string;
  explanation?: string;
}

export function SolutionStep({ step, content, explanation }: SolutionStepProps) {
  return (
    <motion.div
      className="solution-step mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: step * 0.2 }}
    >
      <div className="flex items-start space-x-4">
        <div className="step-number w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-chalk text-gray-600">
          {step}
        </div>
        <div className="flex-1">
          <MathRenderer content={content} display={true} className="mb-2" />
          {explanation && (
            <p className="text-gray-600 text-sm font-chalk mt-2">{explanation}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Equation System component
interface EquationSystemProps {
  equations: string[];
  label?: string;
}

export function EquationSystem({ equations, label }: EquationSystemProps) {
  const content = `\\begin{cases} ${equations.join(' \\\\ ')} \\end{cases}`;
  
  return (
    <div className="equation-system my-4">
      {label && <div className="text-sm text-gray-500 mb-2">{label}</div>}
      <MathRenderer content={content} display={true} />
    </div>
  );
}

// Mathematical Expression with Animation
interface AnimatedExpressionProps {
  steps: string[];
  delay?: number;
}

export function AnimatedExpression({ steps, delay = 0 }: AnimatedExpressionProps) {
  return (
    <div className="animated-expression space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + index * 0.5 }}
        >
          <MathRenderer content={step} display={true} />
        </motion.div>
      ))}
    </div>
  );
}

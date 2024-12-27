import type { Point } from './graph';

export type TeachingStyle = 'step-by-step' | 'quick-response' | 'interactive';

export type ContentSection = 'steps' | 'visual' | 'practice' | 'concepts';

export interface AITutorState {
  teachingStyle: TeachingStyle;
  isCallActive: boolean;
  questionsLeft: number;
}

export interface TeachingStyleSelectorProps {
  selectedStyle: TeachingStyle;
  onSelectStyle: (style: TeachingStyle) => void;
}

export interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface GraphDisplayProps {
  data: DataPoint[];
  type: 'bar' | 'pie';
  title: string;
}

export type PracticeProblem = {
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  solution: string;
};

export type ConceptInfo = {
  title: string;
  description: string;
  relatedTopics: Array<{
    name: string;
    description: string;
  }>;
};

export type FunctionGraphData = {
  type: 'function';
  data: {
    function: string;
    domain: [number, number];
    keyPoints?: {
      intercepts?: [number, number][];
      maxima?: [number, number][];
      minima?: [number, number][];
    };
  };
};

export type VisualData = FunctionGraphData;

export type TutorResponse = {
  type: 'success' | 'error';
  error?: string;
  content: {
    steps: string;
    visual?: FunctionGraphData;
    practice: {
      problems: PracticeProblem[];
    };
    concepts: ConceptInfo;
  };
  questionsLeft?: number;
};

export interface WhiteboardContent {
  steps: string;
  visual?: VisualData;
  practice: {
    problems: PracticeProblem[];
  };
  concepts: ConceptInfo;
}

export interface BaseVisualProps {
  data: VisualData;
  width?: number;
  height?: number;
}

export interface AIResponse {
  type: 'success' | 'error';
  content: WhiteboardContent;
  error?: string;
}

export interface ProcessedAIResponse {
  content: string;
  visualData?: any;
  practiceProblems?: string[];
  relatedConcepts?: string;
}

export type TeacherInfo = {
  id: string;
  name: string;
  subject: 'math' | 'science';
  description: string;
  avatar: string;
  style: TeachingStyle;
};

export type { Point };

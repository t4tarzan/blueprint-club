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

export interface FunctionGraphData {
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
}

export type VisualData = FunctionGraphData;

export interface WhiteboardContent {
  steps: string;
  visual?: VisualData;
  practice: string;
  concepts: string;
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

export interface TeacherInfo {
  id: string;
  name: string;
  subject: 'math' | 'science';
  description: string;
  avatar: string;
}

export type { Point };

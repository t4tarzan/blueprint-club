export type TeachingStyle = 'step-by-step' | 'quick-response' | 'interactive';

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
  color: string;
}

export interface GraphDisplayProps {
  data: DataPoint[];
  type: 'bar' | 'pie';
  title: string;
}

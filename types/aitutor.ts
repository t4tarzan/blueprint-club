export type TeachingStyle = 'step-by-step' | 'quick' | 'interactive';

export interface AITutorState {
  selectedTeacher: 'math' | 'science' | null;
  isCallActive: boolean;
  content: string[];
  isProcessing: boolean;
  teachingStyle: TeachingStyle;
}

export interface TeacherCardProps {
  teacher: 'math' | 'science';
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export interface VoiceStreamingProps {
  isActive: boolean;
  selectedTeacher: 'math' | 'science';
  onTranscript: (text: string) => Promise<void>;
  onSpeechResult: (result: string) => void;
  onSpeechEnd: () => void;
  onError: (error: Error) => void;
}

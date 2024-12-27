import React, { useState, useCallback } from 'react';
import { TeachingStyleSelector } from './TeachingStyleSelector';
import { NotebookWhiteboard } from './NotebookWhiteboard';
import { VoiceStreaming } from './voice-streaming';
import { TeacherCard } from './teacher-card';
import type { TeacherInfo, TeachingStyle, WhiteboardContent, ContentSection } from '@/types/aitutor';

export const AITutor: React.FC = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<'math' | 'science'>('math');
  const [teachingStyle, setTeachingStyle] = useState<TeachingStyle>('step-by-step');
  const [activeSection, setActiveSection] = useState<ContentSection>('steps');
  const [content, setContent] = useState<WhiteboardContent>({
    steps: '',
    visual: undefined,
    practice: '',
    concepts: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [questionsLeft, setQuestionsLeft] = useState(20);

  const handleTeacherSelect = (teacher: 'math' | 'science') => {
    setSelectedTeacher(teacher);
  };

  const handleStyleSelect = (style: TeachingStyle) => {
    setTeachingStyle(style);
  };

  const handleSectionSelect = (section: ContentSection) => {
    setActiveSection(section);
  };

  const processQuestion = async (question: string) => {
    if (!selectedTeacher) return;

    setIsProcessing(true);
    setError(null);
    setIsVoiceActive(false);

    // First update to show the transcribed text
    setContent({
      steps: `Processing your question...\n\n${question}`,
      visual: undefined,
      practice: '',
      concepts: ''
    });

    try {
      const response = await fetch('/api/aitutor/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: question,
          subject: selectedTeacher,
          teachingStyle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

      // Extract the main sections from the response
      const {
        steps = '',
        visual,
        practice = '',
        concepts = ''
      } = parsedData;

      // Format steps content
      const stepsContent = typeof steps === 'string' ? steps : steps.steps || '';

      // Format each section
      const formattedContent: WhiteboardContent = {
        steps: `Your Question: ${question}\n\n${stepsContent}`,
        visual: visual?.Visual || visual,
        practice: practice
          .replace(/Problem \d+ \((Easy|Medium|Hard)\):/g, '\n$&\n')
          .replace(/\n{3,}/g, '\n\n'),
        concepts: concepts
          .replace(/Title:/g, '\n# ')
          .replace(/Description:/g, '\n')
          .replace(/Related Topics:/g, '\n## Related Topics:\n')
          .replace(/Examples:/g, '\n## Examples:\n')
          .replace(/Problem:/g, '\n### Problem:\n')
          .replace(/Solution:/g, '\n### Solution:\n')
      };

      setContent(formattedContent);
      setQuestionsLeft(prev => Math.max(0, prev - 1));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setContent({
        steps: `Your Question: ${question}\n\nSorry, I encountered an error while processing your question.`,
        visual: undefined,
        practice: '',
        concepts: ''
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranscript = (transcript: string) => {
    // Show the transcribed text immediately
    setContent(prev => ({
      ...prev,
      steps: `Your Question: ${transcript}`,
    }));
    
    // Auto-submit after a short delay to allow reading the transcribed text
    setTimeout(() => {
      processQuestion(transcript);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Top Section */}
        <div className="space-y-6 mb-8">
          {/* Math Teacher */}
          <TeacherCard
            teacher="math"
            isSelected={selectedTeacher === 'math'}
            onSelect={() => setSelectedTeacher('math')}
            disabled={isProcessing}
          />
          {/* Science Teacher */}
          <TeacherCard
            teacher="science"
            isSelected={selectedTeacher === 'science'}
            onSelect={() => setSelectedTeacher('science')}
            disabled={isProcessing}
          />

          {/* Teaching Style */}
          <TeachingStyleSelector
            selectedStyle={teachingStyle}
            onStyleSelect={setTeachingStyle}
            onFeatureSelect={setActiveSection}
            selectedFeature={activeSection}
          />
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Feature Tabs */}
          <div className="bg-gray-100 px-4 py-2 border-b">
          </div>

          {/* Voice Input */}
          <div className="p-4 bg-blue-50">
            <VoiceStreaming 
              onTranscript={handleTranscript}
              isActive={isVoiceActive}
              disabled={isProcessing}
            />
          </div>

          {/* Notebook */}
          <div className="h-[600px]">
            <NotebookWhiteboard
              content={content}
              activeSection={activeSection}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

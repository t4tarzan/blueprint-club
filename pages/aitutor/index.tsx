import React, { useState } from 'react';
import { TeacherCard } from '@/components/aitutor/teacher-card';
import { VoiceStreaming } from '@/components/aitutor/voice-streaming';
import { NotebookWhiteboard } from '@/components/aitutor/NotebookWhiteboard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeachingStyleSelector } from '@/components/aitutor/TeachingStyleSelector';
import { InputBar } from '@/components/aitutor/input-bar'; // Fixed import path
import type { WhiteboardContent, TeachingStyle, ContentSection, FunctionGraphData } from '@/types/aitutor';
import { motion, AnimatePresence } from 'framer-motion';
import type { NextPage } from 'next';

const defaultWhiteboardContent: WhiteboardContent = {
  steps: '',
  visual: {
    type: 'function',
    data: {
      function: 'x',
      domain: [-10, 10]
    }
  },
  practice: {
    problems: []
  },
  concepts: {
    title: '',
    description: '',
    relatedTopics: []
  }
};

const AITutorPage: NextPage = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<'math' | 'science' | null>(null);
  const [questionsLeft, setQuestionsLeft] = useState(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [whiteboardContent, setWhiteboardContent] = useState<WhiteboardContent>(defaultWhiteboardContent);
  const [teachingStyle, setTeachingStyle] = useState<TeachingStyle>('step-by-step');
  const [activeSection, setActiveSection] = useState<ContentSection>('steps');

  const handleTeachingStyleChange = (style: TeachingStyle) => {
    setTeachingStyle(style);
    if (style === 'step-by-step') {
      setActiveSection('steps');
    }
  };

  const handleFeatureSelect = (feature: ContentSection) => {
    setActiveSection(feature);
  };

  const handleUserInput = async (text: string) => { // New function to handle user input
    if (!selectedTeacher) return;

    setIsProcessing(true);
    setWhiteboardContent(prev => ({
      ...prev,
      steps: `Your Question: ${text}\n\nThinking...`
    }));

    try {
      const response = await fetch('/api/aitutor/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          subject: selectedTeacher,
          teachingStyle
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      const data = await response.json();
      console.log('=== API Response ===');
      console.log('Raw data:', JSON.stringify(data, null, 2));

      if (data.type === 'error') {
        console.error('Server returned error:', data.error);
        setWhiteboardContent(prevContent => ({
          ...prevContent,
          steps: `Sorry, there was an error: ${data.error || 'Unknown error'}`,
          visual: defaultWhiteboardContent.visual,
          practice: defaultWhiteboardContent.practice,
          concepts: defaultWhiteboardContent.concepts
        }));
        return;
      }

      if (data.type === 'success' && data.content) {
        console.log('Setting whiteboard content:', JSON.stringify(data.content, null, 2));
        setWhiteboardContent(prevContent => {
          console.log('Previous content:', JSON.stringify(prevContent, null, 2));
          const newContent = {
            steps: data.content.steps || prevContent.steps,
            visual: data.content.visual || prevContent.visual,
            practice: data.content.practice || prevContent.practice,
            concepts: data.content.concepts || prevContent.concepts
          };
          console.log('New content:', JSON.stringify(newContent, null, 2));
          return newContent;
        });
      } else {
        console.error('Invalid response format:', data);
        setWhiteboardContent(prevContent => ({
          ...prevContent,
          steps: 'Sorry, received an invalid response format',
          visual: defaultWhiteboardContent.visual,
          practice: defaultWhiteboardContent.practice,
          concepts: defaultWhiteboardContent.concepts
        }));
      }

      if (typeof data.questionsLeft === 'number') {
        setQuestionsLeft(data.questionsLeft);
      }
    } catch (error) {
      console.error('Error:', error);
      setWhiteboardContent(prev => ({
        ...prev,
        steps: `Your Question: ${text}\n\nSorry, there was an error processing your request.`,
        visual: {
          type: 'function',
          data: {
            function: 'x',
            domain: [-10, 10]
          }
        },
        practice: {
          problems: []
        },
        concepts: {
          title: '',
          description: '',
          relatedTopics: []
        }
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout currentPath="/aitutor">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white shadow-sm flex-none">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Progress meter */}
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-700">Questions</div>
                <div className="w-40 h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <motion.div 
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(20 - questionsLeft) * 5}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {questionsLeft} remaining
                </div>
              </div>

              {/* Teaching Style Selector */}
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <TeachingStyleSelector
                    selectedStyle={teachingStyle}
                    onStyleSelect={handleTeachingStyleChange}
                    onFeatureSelect={handleFeatureSelect}
                    selectedFeature={activeSection}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Session Status */}
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-600 font-medium">Session Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-[1800px] mx-auto px-3">
            <div className="h-full flex gap-4">
              {/* Left Teacher */}
              <div className="w-[16%] flex-none">
                <TeacherCard
                  teacher="math"
                  isSelected={selectedTeacher === 'math'}
                  onSelect={() => setSelectedTeacher('math')}
                  disabled={isProcessing}
                />
              </div>

              {/* Center Content */}
              <div className="flex-1 flex flex-col min-w-0">
                <NotebookWhiteboard
                  content={whiteboardContent}
                  isProcessing={isProcessing}
                  activeSection={activeSection}
                />
              </div>

              {/* Right Teacher */}
              <div className="w-[16%] flex-none">
                <TeacherCard
                  teacher="science"
                  isSelected={selectedTeacher === 'science'}
                  onSelect={() => setSelectedTeacher('science')}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Voice Control */}
        <div className="flex-none bg-white border-t border-gray-200">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <VoiceStreaming
              isActive={!!selectedTeacher && !isProcessing}
              onTranscript={handleUserInput}
              disabled={!selectedTeacher || isProcessing}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AITutorPage;

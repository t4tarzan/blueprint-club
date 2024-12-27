import { useState } from 'react';
import { TeacherCard } from '@/components/aitutor/teacher-card';
import { VoiceStreaming } from '@/components/aitutor/voice-streaming';
import { useSession } from 'next-auth/react';
import { NotebookWhiteboard } from '@/components/aitutor/NotebookWhiteboard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeachingStyleSelector, TeachingStyle } from '@/components/aitutor/TeachingStyle';
import { motion, AnimatePresence } from 'framer-motion';

export default function AITutor() {
  const [selectedTeacher, setSelectedTeacher] = useState<'math' | 'science' | null>(null);
  const [questionsLeft, setQuestionsLeft] = useState(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [whiteboardContent, setWhiteboardContent] = useState('');
  const [graphData, setGraphData] = useState<any>(null);
  const [teachingStyle, setTeachingStyle] = useState<TeachingStyle>('step-by-step');
  const [showTeachingStyles, setShowTeachingStyles] = useState(false);

  const handleTeachingStyleChange = (style: TeachingStyle) => {
    setTeachingStyle(style);
    setShowTeachingStyles(false);
  };

  const handleTranscript = async (text: string) => {
    if (!selectedTeacher) return;

    setIsProcessing(true);
    setWhiteboardContent(`Processing your question...\n\n${text}`);

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
      
      // Clean and format the response text
      const formattedText = data.text
        // Remove code block markers
        .replace(/```/g, '')
        // Remove bullet points and other markers
        .replace(/^[•*#\s]+/gm, '')
        // Format math expressions
        .replace(/\\frac{([^}]*)}{([^}]*)}/g, '$\\frac{$1}{$2}$')
        .replace(/([^$])\^(\d+|{[^}]+})/g, '$1$^$2$')
        // Clean up extra whitespace
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line)
        .join('\n');

      setWhiteboardContent(formattedText);
      setGraphData(data.graphData);
      setQuestionsLeft(data.questionsLeft);

    } catch (error) {
      console.error('Error:', error);
      setWhiteboardContent('Sorry, there was an error processing your request.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout currentPath="/aitutor">
      <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
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
              <TeachingStyleSelector
                selectedStyle={teachingStyle}
                onStyleSelect={handleTeachingStyleChange}
              />

              {/* Session Status */}
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600 font-medium">Session Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="h-full flex gap-6">
              {/* Left Teacher */}
              <div className="w-72 flex-none">
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
                  teachingStyle={teachingStyle}
                  isProcessing={isProcessing}
                  selectedSubject={selectedTeacher}
                  graphData={graphData}
                />
              </div>

              {/* Right Teacher */}
              <div className="w-72 flex-none">
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
              onTranscript={handleTranscript}
              disabled={!selectedTeacher || isProcessing}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

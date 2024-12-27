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
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
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
    setAudioUrl(null);

    try {
      // First get the text response
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

      // Update whiteboard with the response
      setWhiteboardContent(data.text);
      setGraphData(data.graphData);
      setQuestionsLeft(data.questionsLeft);

      // Extract a short summary for voice
      const summary = data.text
        .split('\n')
        .filter((line: string) => line.includes('Final Answer') || line.includes('Therefore'))
        .join('\n');

      setExplanation(summary);

      // Generate voice for the summary
      if (summary) {
        setIsGeneratingVoice(true);
        try {
          const voiceResponse = await fetch('/api/aitutor/voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              text: summary,
              teacher: selectedTeacher 
            }),
          });

          if (!voiceResponse.ok) {
            const errorData = await voiceResponse.json();
            console.error('Voice generation failed:', errorData);
            throw new Error(errorData.details || 'Failed to generate voice');
          }

          const voiceData = await voiceResponse.json();
          setAudioUrl(voiceData.audioUrl);
        } catch (error) {
          console.error('Voice error:', error);
          setWhiteboardContent(prev => 
            prev + '\n\nNote: Voice generation failed. You can still read the explanation above.');
        } finally {
          setIsGeneratingVoice(false);
        }
      }

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
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <TeachingStyleSelector
                    selectedStyle={teachingStyle}
                    onStyleSelect={handleTeachingStyleChange}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Session Info */}
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-600">Session Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-[1600px] mx-auto h-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left Tutor */}
              <div className="lg:col-span-3 h-[calc(100vh-16rem)]">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TeacherCard
                    teacher="math"
                    isSelected={selectedTeacher === 'math'}
                    onSelect={() => setSelectedTeacher('math')}
                    disabled={isProcessing}
                  />
                </motion.div>
              </div>
              
              {/* Center Whiteboard */}
              <div className="lg:col-span-6 h-[calc(100vh-16rem)] flex flex-col relative">
                {!selectedTeacher && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg border-2 border-dashed border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-center p-8">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Welcome to AI Tutor! 👋
                      </h3>
                      <p className="text-gray-600 max-w-md">
                        Select a teacher to start your learning journey. Choose Math for mathematical concepts or Science for scientific exploration.
                      </p>
                    </div>
                  </motion.div>
                )}
                <div className="flex-1 min-h-0">
                  <NotebookWhiteboard
                    content={whiteboardContent}
                    isProcessing={isProcessing}
                    selectedSubject={selectedTeacher}
                    graphData={graphData}
                    teachingStyle={teachingStyle}
                  />
                </div>
                {selectedTeacher && (
                  <div className="mt-4 bg-white rounded-lg shadow-lg p-4 flex-none">
                    <VoiceStreaming
                      isActive={true}
                      onTranscript={handleTranscript}
                      disabled={isProcessing || isGeneratingVoice}
                    />
                    {audioUrl && (
                      <audio
                        src={audioUrl}
                        controls
                        className="w-full mt-4"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Right Tutor */}
              <div className="lg:col-span-3 h-[calc(100vh-16rem)]">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TeacherCard
                    teacher="science"
                    isSelected={selectedTeacher === 'science'}
                    onSelect={() => setSelectedTeacher('science')}
                    disabled={isProcessing}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

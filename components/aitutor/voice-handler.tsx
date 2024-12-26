import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceHandlerProps {
  isCallActive: boolean;
  onSpeechResult: (text: string) => void;
  onError: (error: string) => void;
}

export function VoiceHandler({ isCallActive, onSpeechResult, onError }: VoiceHandlerProps) {
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<any>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const result = Array.from(event.results).pop();
        if (result?.[0]?.transcript) {
          onSpeechResult(result[0].transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        onError(event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onSpeechResult, onError]);

  useEffect(() => {
    const setupAudioAnalyser = async () => {
      try {
        if (isCallActive) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const source = audioContext.createMediaStreamSource(stream);
          
          analyser.fftSize = 256;
          source.connect(analyser);
          analyserRef.current = analyser;

          const updateAudioLevel = () => {
            if (!analyserRef.current) return;
            
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            
            // Calculate average volume level
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(average / 128); // Normalize to 0-1

            animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
          };

          updateAudioLevel();
          recognitionRef.current?.start();
          setIsListening(true);
        } else {
          recognitionRef.current?.stop();
          setIsListening(false);
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        }
      } catch (error) {
        console.error('Error accessing microphone:', error);
        onError('Error accessing microphone');
      }
    };

    setupAudioAnalyser();
  }, [isCallActive, onError]);

  return (
    <AnimatePresence>
      {isCallActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-8 right-8 flex items-center space-x-4 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg"
        >
          {/* Voice Visualizer */}
          <div className="flex items-center space-x-1 h-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-blue-500 rounded-full"
                animate={{
                  height: isListening ? [8, 32 * audioLevel, 8] : 8,
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {isListening ? 'Listening...' : 'Starting...'}
            </span>
            <span className="text-xs text-gray-500">
              Speak clearly into your microphone
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

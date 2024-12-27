import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface VoiceStreamingProps {
  onTranscript: (text: string) => void;
  isActive: boolean;
}

export function VoiceStreaming({ onTranscript, isActive }: VoiceStreamingProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for browser support
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setError('Speech recognition is not supported in this browser.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');

        if (event.results[0].isFinal) {
          onTranscript(transcript);
          recognition.stop();
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error === 'not-allowed' 
          ? 'Please allow microphone access to use voice input.'
          : 'An error occurred with speech recognition.');
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTranscript]);

  const toggleListening = useCallback(async () => {
    if (!recognition) return;

    try {
      if (!isListening) {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognition.start();
      } else {
        recognition.stop();
      }
    } catch (err) {
      setError('Please allow microphone access to use voice input.');
      setIsListening(false);
    }
  }, [recognition, isListening]);

  if (error) {
    return (
      <div className="flex items-center justify-center space-x-2 text-red-500">
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
      <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${
        isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'
      }`} />
      <span className="text-sm text-gray-600 min-w-[100px]">
        {isListening ? 'Listening...' : 'Click to speak'}
      </span>
      <Button
        onClick={toggleListening}
        disabled={!isActive}
        variant={isListening ? "destructive" : "default"}
        size="sm"
        className="min-w-[80px]"
      >
        {isListening ? 'Stop' : 'Start'}
      </Button>
    </div>
  );
}

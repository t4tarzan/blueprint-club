import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface VoiceStreamingProps {
  onTranscript: (text: string) => void;
  isActive: boolean;
}

export function VoiceStreaming({ onTranscript, isActive }: VoiceStreamingProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // @ts-ignore
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');

        if (event.results[0].isFinal) {
          onTranscript(transcript);
          recognition.stop();
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
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

  useEffect(() => {
    if (!isActive && isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [isActive, isListening, recognition]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (!isListening) {
      recognition.start();
      setIsListening(true);
    } else {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  if (!recognition) {
    return <div>Speech recognition not supported in this browser.</div>;
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${
        isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'
      }`} />
      <span className="text-sm text-gray-600">
        {isListening ? 'Listening...' : 'Click to speak'}
      </span>
      <Button
        onClick={toggleListening}
        disabled={!isActive}
        variant={isListening ? "destructive" : "default"}
        size="sm"
      >
        {isListening ? 'Stop' : 'Start'}
      </Button>
    </div>
  );
}

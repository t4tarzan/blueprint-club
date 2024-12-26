import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TestAI() {
  const [geminiResult, setGeminiResult] = useState<string>('');
  const [elevenLabsResult, setElevenLabsResult] = useState<string>('');
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [isTestingElevenLabs, setIsTestingElevenLabs] = useState(false);
  const [error, setError] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const testGemini = async () => {
    setIsTestingGemini(true);
    setError('');
    try {
      const response = await fetch('/api/test/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Solve this simple math problem step by step: 24 + 40',
        }),
      });
      const data = await response.json();
      setGeminiResult(data.result || data.error);
    } catch (err: any) {
      setError(`Gemini Test Error: ${err.message}`);
    } finally {
      setIsTestingGemini(false);
    }
  };

  const testElevenLabs = async () => {
    setIsTestingElevenLabs(true);
    setError('');
    setAudioUrl(null);
    try {
      const response = await fetch('/api/test/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Let me explain this math problem. We start by adding the tens: 20 plus 40 equals 60. Then we add the ones: 4 plus 0 equals 4. Finally, combining them gives us 64.',
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
        setElevenLabsResult('Audio generated successfully! Click play below.');
      }
    } catch (err: any) {
      setError(`ElevenLabs Test Error: ${err.message}`);
      setElevenLabsResult('Failed to generate audio');
    } finally {
      setIsTestingElevenLabs(false);
    }
  };

  return (
    <DashboardLayout currentPath="/testai">
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">AI Integration Tests</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Gemini Test Section */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Gemini API Test</h2>
            <button
              onClick={testGemini}
              disabled={isTestingGemini}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isTestingGemini ? 'Testing...' : 'Test Gemini API'}
            </button>
            {geminiResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <pre className="whitespace-pre-wrap">{geminiResult}</pre>
              </div>
            )}
          </div>

          {/* ElevenLabs Test Section */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">ElevenLabs API Test</h2>
            <button
              onClick={testElevenLabs}
              disabled={isTestingElevenLabs}
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 disabled:bg-purple-300"
            >
              {isTestingElevenLabs ? 'Testing...' : 'Test ElevenLabs API'}
            </button>
            {elevenLabsResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <pre className="whitespace-pre-wrap">{elevenLabsResult}</pre>
              </div>
            )}
            {audioUrl && (
              <div className="mt-4">
                <audio controls src={audioUrl} className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

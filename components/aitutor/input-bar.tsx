import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InputBarProps {
  onSubmit: (text: string) => void;
  isProcessing?: boolean;
  disabled?: boolean;
}

export function InputBar({ onSubmit, isProcessing = false, disabled = false }: InputBarProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    if (inputText.trim()) {
      onSubmit(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your question..."
        disabled={disabled || isProcessing}
        className="w-[400px] h-12 rounded-lg border-gray-300 focus:border-[#4B83F2] focus:ring-[#4B83F2]"
      />
      <Button
        onClick={handleSubmit}
        disabled={disabled || isProcessing || !inputText.trim()}
        className="h-12 px-6 bg-[#4B83F2] hover:bg-[#4B83F2]/90 text-white"
      >
        Send
      </Button>
    </div>
  );
}

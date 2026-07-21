import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle, RefreshCw } from 'lucide-react';

interface PromptInputProps {
  onSend: (text: string) => void;
  onCancel?: () => void;
  isGenerating?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSend, onCancel, isGenerating }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !isGenerating) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape' && isGenerating && onCancel) {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="p-3 bg-white border-t border-slate-200">
      <div className="relative border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 bg-slate-50 transition-all flex items-end overflow-hidden shadow-sm">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI to write, rewrite, or analyze... (Ctrl+Enter to send)"
          className="w-full bg-transparent border-0 resize-none max-h-[200px] py-3 pl-4 pr-12 focus:ring-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
          rows={1}
          disabled={isGenerating}
        />
        <div className="absolute right-2 bottom-2">
          {isGenerating ? (
            <button 
              onClick={onCancel}
              className="p-1.5 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
              title="Cancel Generation (Esc)"
            >
              <StopCircle className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSend}
              disabled={!text.trim()}
              className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:bg-slate-300"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 px-1">
        <p className="text-[10px] text-slate-400">Ctrl + Enter to send • Esc to cancel</p>
        <p className="text-[10px] text-slate-400">{text.length} / 4000</p>
      </div>
    </div>
  );
};

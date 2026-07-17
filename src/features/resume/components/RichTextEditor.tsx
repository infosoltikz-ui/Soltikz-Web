import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  error?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  maxLength = 2000,
  minLength,
  error
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync external value changes (like initial load)
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      // Only update if it's actually different to avoid cursor jumps
      if (value) {
        editorRef.current.innerHTML = value;
      } else if (!value && editorRef.current.innerHTML !== '') {
        editorRef.current.innerHTML = '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    handleInput();
  };

  const getPlainText = () => {
    if (!editorRef.current) return '';
    return editorRef.current.innerText || '';
  };

  const charCount = getPlainText().length;
  const isOverLimit = maxLength && charCount > maxLength;

  return (
    <div className="flex flex-col gap-2">
      <div className={cn(
        "border rounded-xl overflow-hidden bg-white transition-colors focus-within:ring-2 focus-within:border-transparent",
        error ? "border-rose-300 focus-within:ring-rose-200" : "border-slate-200 focus-within:ring-primary-100",
        isOverLimit && "border-rose-300 focus-within:ring-rose-200"
      )}>
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
          <ToolbarButton onClick={() => execCommand('bold')} icon={<Bold className="w-4 h-4" />} title="Bold" />
          <ToolbarButton onClick={() => execCommand('italic')} icon={<Italic className="w-4 h-4" />} title="Italic" />
          <ToolbarButton onClick={() => execCommand('underline')} icon={<Underline className="w-4 h-4" />} title="Underline" />
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <ToolbarButton onClick={() => execCommand('insertUnorderedList')} icon={<List className="w-4 h-4" />} title="Bullet List" />
          <ToolbarButton onClick={() => execCommand('insertOrderedList')} icon={<ListOrdered className="w-4 h-4" />} title="Numbered List" />
        </div>

        {/* Editor Area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          className="min-h-[200px] p-4 outline-none prose prose-sm max-w-none text-slate-700 focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
          data-placeholder={placeholder}
        />
      </div>

      {/* Footer / Counters */}
      <div className="flex items-center justify-between px-1">
        <div>
          {error && <span className="text-xs text-rose-500">{error}</span>}
          {isOverLimit && !error && <span className="text-xs text-rose-500">Maximum character limit exceeded</span>}
        </div>
        <div className={cn(
          "text-xs font-medium",
          isOverLimit ? "text-rose-500" : "text-slate-400"
        )}>
          {charCount} / {maxLength}
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ onClick, icon, title }: { onClick: () => void, icon: React.ReactNode, title: string }) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={title}
    className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded-md transition-colors"
  >
    {icon}
  </button>
);

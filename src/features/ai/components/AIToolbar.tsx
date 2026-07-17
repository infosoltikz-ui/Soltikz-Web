import React from 'react';
import { useAISettings, useUpdateAISettings } from '../hooks/ai.queries';
import { Settings2, Zap, Download } from 'lucide-react';

export const AIToolbar: React.FC = () => {
  const { data: settings } = useAISettings();
  const updateSettings = useUpdateAISettings();

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings.mutate({ provider: e.target.value });
  };

  return (
    <div className="flex items-center justify-between p-2 border-b border-slate-100 bg-white">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-md">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <select 
            value={settings?.provider || 'OPENAI'} 
            onChange={handleProviderChange}
            className="bg-transparent border-0 py-0 pl-1 pr-6 text-xs font-medium text-slate-700 focus:ring-0 cursor-pointer"
          >
            <option value="OPENAI">OpenAI</option>
            <option value="CLAUDE">Claude</option>
            <option value="GEMINI">Gemini</option>
          </select>
        </div>
        
        <span className="text-slate-300">|</span>
        
        <div className="text-[10px] text-slate-500 font-medium">
          {settings?.preferredModel || 'Default Model'}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors" title="Export Chat">
          <Download className="w-4 h-4" />
        </button>
        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors" title="Settings">
          <Settings2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

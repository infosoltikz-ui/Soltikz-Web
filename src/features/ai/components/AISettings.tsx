import React from 'react';
import { useAISettings, useUpdateAISettings } from '../hooks/ai.queries';
import { Settings, Save, Loader2 } from 'lucide-react';

export const AISettingsPanel: React.FC = () => {
  const { data: settings, isLoading } = useAISettings();
  const updateSettings = useUpdateAISettings();

  if (isLoading) {
    return <div className="p-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>;
  }

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings.mutate({ provider: e.target.value });
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings.mutate({ preferredModel: e.target.value });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
        <Settings className="w-4 h-4" />
        <h3>AI Provider Settings</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Provider</label>
          <select 
            className="w-full text-sm border-slate-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={settings?.provider || 'OPENAI'}
            onChange={handleProviderChange}
            disabled={updateSettings.isPending}
          >
            <option value="OPENAI">OpenAI</option>
            <option value="CLAUDE">Anthropic Claude</option>
            <option value="GEMINI">Google Gemini</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Model</label>
          <select 
            className="w-full text-sm border-slate-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={settings?.preferredModel || ''}
            onChange={handleModelChange}
            disabled={updateSettings.isPending}
          >
            {settings?.provider === 'OPENAI' && (
              <>
                <option value="gpt-4o-mini">GPT-4o Mini (Fast)</option>
                <option value="gpt-4o">GPT-4o (Smart)</option>
              </>
            )}
            {settings?.provider === 'CLAUDE' && (
              <>
                <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
                <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</option>
              </>
            )}
            {settings?.provider === 'GEMINI' && (
              <>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              </>
            )}
          </select>
        </div>
      </div>
      
      {updateSettings.isPending && (
        <p className="text-xs text-slate-400 flex items-center gap-1 mt-2">
          <Loader2 className="w-3 h-3 animate-spin" /> Saving...
        </p>
      )}
    </div>
  );
};

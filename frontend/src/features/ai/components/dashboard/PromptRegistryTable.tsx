import React from 'react';
import { usePromptRegistry } from '../../hooks/useAIPlatform';
import { Database, FileText } from 'lucide-react';

export const PromptRegistryTable: React.FC = () => {
  const { data: prompts, isLoading } = usePromptRegistry();

  if (isLoading) return <div className="p-4 border rounded-lg bg-gray-50 text-sm animate-pulse">Loading Registry...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" />
          Prompt Registry
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Version</th>
              <th className="px-5 py-3 font-medium">Provider</th>
              <th className="px-5 py-3 font-medium">Variables</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {prompts?.map((prompt: any) => (
              <tr key={prompt.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  {prompt.category}
                </td>
                <td className="px-5 py-3">v{prompt.version}</td>
                <td className="px-5 py-3">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {prompt.provider || 'ALL'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {prompt.variables.map((v: string) => (
                      <span key={v} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100">
                        {v}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  {prompt.isActive ? (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">Active</span>
                  ) : (
                    <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-200">Archived</span>
                  )}
                </td>
              </tr>
            ))}
            {(!prompts || prompts.length === 0) && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                  No prompts found in the registry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

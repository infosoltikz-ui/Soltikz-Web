import React from 'react';
import { useBillingStore } from '../store/useBillingStore';
import { FileText, Cpu, LayoutTemplate, Briefcase } from 'lucide-react';

export const UsageCards = () => {
  const { usage } = useBillingStore();

  if (!usage) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <FileText size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Resumes Created</p>
          <p className="text-xl font-bold">{usage.resumeCount}</p>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
          <Cpu size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">AI Generations</p>
          <p className="text-xl font-bold">{usage.resumeAnalyzerCount || usage.aiTokens}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
          <LayoutTemplate size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Cover Letters</p>
          <p className="text-xl font-bold">{usage.coverLetterCount}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
          <Briefcase size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">ATS Scans</p>
          <p className="text-xl font-bold">{usage.atsScans}</p>
        </div>
      </div>
    </div>
  );
};
